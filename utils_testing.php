<?php

$img_host = ''; # Fill in your own
function getBonusSchedulePart1($survey)
{
    return array();
    // Display participation reward as bonus in part 1
    // return array(
    //     0 => array('level_threshold' => $survey['tasks_required'],
    //         'amount' => $survey['participation_reward']),
    // );
}

function userExists($cid, $id, $survey_id)
{
    $stmt = $cid->prepare("SELECT COUNT(*) from `user` WHERE id = ? AND survey_id = ?");
    $stmt->bind_param('ss', $id, $survey_id);
    $stmt->execute();
    $stmt->bind_result($result);
    $stmt->fetch();
    $stmt->close();
    if ($result == 0) {
        return false;
    }

    return true;
}

function userInfo($cid, $id, $survey_id)
{
    $stmt = $cid->prepare("SELECT * from `user` WHERE id = ? AND survey_id = ? LIMIT 1");
    $stmt->bind_param('ss', $id, $survey_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();
    return $user;
}

function surveyInfo($cid, $survey_id)
{
    $stmt = $cid->prepare("SELECT * from `survey` WHERE id = ? LIMIT 1");
    $stmt->bind_param('s', $survey_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $survey = $result->fetch_assoc();
    $stmt->close();
    return $survey;
}

function badgeInfo($cid, $badge_id)
{
    $stmt = $cid->prepare("SELECT * from `badge` WHERE id = ? LIMIT 1");
    $stmt->bind_param('s', $badge_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $badge = $result->fetch_assoc();
    $stmt->close();
    $badge['piece_rate_schedule'] = getPieceRateSchedule($cid, $badge['social_piece_rate']);
    $badge['piece_rate_earnings'] = dollar(totalPieceRateEarnings($badge['piece_rate_schedule'], $badge['tasks'])['number']);
    $badge['bonus_schedule'] = getBonusSchedule($cid, $badge['private_bonus']);
    $badge['bonus_earnings'] = dollar(totalBonusEarnings($badge['bonus_schedule'], $badge['tasks'])['number']);
    $badge['profile_picture'] = ''; # Fill in your own

    return $badge;
}

function badgePairingInfo($cid, $badge_pairing_id)
{
    $stmt = $cid->prepare("SELECT * from `badge_pairing` WHERE id = ? LIMIT 1");
    $stmt->bind_param('s', $badge_pairing_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $info = $result->fetch_assoc();
    $stmt->close();
    return $info;
}

function getJudgements($cid, $id, $survey_id, $judgement_type)
{
    $stmt = $cid->prepare("SELECT * FROM `judgement` WHERE judge_id = ? AND survey_id = ? AND judgement_type = ? ORDER BY `timestamp` DESC");
    $stmt->bind_param('sss', $id, $survey_id, $judgement_type);
    $stmt->execute();
    $result = $stmt->get_result();
    $judgements = array();
    while ($row = $result->fetch_assoc()) {
        foreach ($row as $key => $value) {
            $judgements[$key][] = $value;
        }
    }
    $stmt->close();
    return $judgements;
}

function countBadgeJudgements($cid, $id, $survey_id, $judgement_type)
{
    $user = userInfo($cid, $id, $survey_id);
    $cutoff_time = $user['timestamp'];
    $stmt = $cid->prepare("SELECT `self`.id, badge_id_1, badge_id_2, sampling_weight, reversal_group_id, count_self, count_others FROM (
        SELECT id, badge_id_1, badge_id_2, sampling_weight, reversal_group_id, IFNULL(count, 0) as count_self FROM badge_pairing
    LEFT JOIN (SELECT pairing_id, COUNT(*) as count FROM `judgement` WHERE judge_id = ? AND
    survey_id = ? AND
    judgement_type = ? AND
    pairing_type = 'badge'
    GROUP BY pairing_id) counts
    on badge_pairing.id = counts.pairing_id
    ) `self`
    JOIN
    (
        SELECT id, IFNULL(count, 0) as count_others from badge_pairing
    LEFT JOIN (SELECT pairing_id, COUNT(DISTINCT judge_id) as count FROM `judgement` WHERE judge_id != ? AND
    survey_id = ? AND
    judgement_type = ? AND
    `timestamp` < ? AND
    pairing_type = 'badge'
    GROUP BY pairing_id) counts
    on badge_pairing.id = counts.pairing_id
    ) others
    ON self.id = others.id
    ORDER BY count_self ASC, count_others ASC");
    $stmt->bind_param('sssssss', $id, $survey_id, $judgement_type,
        $id, $survey_id, $judgement_type, $cutoff_time);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = $result->fetch_all(MYSQLI_ASSOC);

    $stmt->close();
    return $count;
}

function numJudged($cid, $id, $survey_id, $judgement_type)
{
    $judgements = getJudgements($cid, $id, $survey_id, $judgement_type);
    if (!$judgements) {
        $numJudged = 0;
    } else {
        $numJudged = sizeof($judgements['judge_id']);
    }
    return $numJudged;
}

function getBonusThresholds($bonus_schedule)
{
    $thresholds = array();
    foreach ($bonus_schedule as $key => $value) {
        $thresholds[$key] = $value['level_threshold'];
    }
    return $thresholds;
}

function countUnderseenUserPairings($cid, $id, $survey_id)
{
    $stmt = $cid->prepare("SELECT COUNT(*) FROM `user_pairing` WHERE survey_id = ? AND judgement_counter < 1 AND
    NOT EXISTS ( SELECT * FROM `judgement` WHERE survey_id = ? AND judge_id = ? AND pairing_type = 'user' AND pairing_id = `user_pairing`.id )");
    $stmt->bind_param('sss', $survey_id, $survey_id, $id);
    $stmt->execute();
    $stmt->bind_result($result);
    $stmt->fetch();
    $stmt->close();
    return $result;
}

function chooseUnderseenUserPairing($cid, $id, $survey_id)
{
    $stmt = $cid->prepare("SELECT * from `user_pairing` WHERE survey_id = ? AND judgement_counter < 1 AND
    NOT EXISTS ( SELECT * FROM judgement WHERE survey_id = ? AND judge_id = ? AND pairing_type = 'user' AND pairing_id = `user_pairing`.id ) ORDER BY `user_pairing`.id
    LIMIT 1");
    $stmt->bind_param('sss', $survey_id, $survey_id, $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $pairing = $result->fetch_assoc();
    $stmt->close();

    if ($pairing) {
        $pairing['type'] = 'user';
        $pairing['badge_1'] = createBadgeFromUser($cid, $pairing['user_id_1'], $survey_id);
        $pairing['badge_2'] = createBadgeFromUser($cid, $pairing['user_id_2'], $survey_id);
        $salt = 'nedistnett';
        $salted_hash_int = createSaltedHashInt($id, $salt);

        if ($salted_hash_int($pairing['id']) & 1) {
            $pairing['display_order'] = '21';
        } else {
            $pairing['display_order'] = '12';
        }
        return $pairing;
    }
    return $pairing;
}

function showableBadge($cid, $badge)
{
    return $badge['matching_users'] + $badge['matching_users_pilot'];
}

function createShowPair($cid)
{
    return function ($pairing) use ($cid) {
        return (
            showableBadge($cid, badgeInfo($cid, $pairing['badge_id_1'])) && (
                showableBadge($cid, badgeInfo($cid, $pairing['badge_id_2'])))
        );
    };
}

function createSaltedHashInt($id, $salt)
{
    return function ($key) use ($id, $salt) {
        $hash = sha1($key . $id . $salt);
        // Integer is 32 bits signed
        $hash_int = (int) (base_convert(substr($hash, -7), 16, 10));
        mt_srand($hash_int);
        return mt_rand();
    };
}

function divideAndCeil($numerator, $denominator)
{
    return ceil($numerator / $denominator);
}

function createEqual($b)
{
    return function ($a) use ($b) {
        return (int) $a == $b;
    };
}
function chooseBadgePairing($cid, $id, $survey_id, $judgement_type, $remaining_judgements)
{
    $badgePairings = countBadgeJudgements($cid, $id, $survey_id, $judgement_type);

    // Only show badges that have matching users
    $badgePairings = array_filter($badgePairings, createShowPair($cid));

    if (!$badgePairings) {
        return $badgePairings;
    }

    // Use hash function to choose random element, and
    // random display order without
    // choosing a new pair on each reload
    // Based on https://stackoverflow.com/a/32461188
    $salt = 'nedistnett';
    $salted_hash_int = createSaltedHashInt($id, $salt);
    $ids = array_column($badgePairings, 'id');
    $hashed_ids = array_map($salted_hash_int, array_values($ids));
    $counts_self = array_column($badgePairings, 'count_self');
    $counts_others = array_column($badgePairings, 'count_others');
    $sampling_weights = array_column($badgePairings, 'sampling_weight');
    $counts_others_weighted = array_map('divideAndCeil', $counts_others, $sampling_weights);

    $unmatched_reversal_id = getUnmatchedReversalGroupId($cid, $id, $survey_id, $judgement_type);
    if ($unmatched_reversal_id > 0 && (($remaining_judgements * $salted_hash_int($unmatched_reversal_id) / mt_getrandmax()) <= 1.0)) {
        $reversal_group_ids = array_column($badgePairings, 'reversal_group_id');
        $equal_unmatched_reversal = createEqual($unmatched_reversal_id);
        $reversal_group_priority = array_map($equal_unmatched_reversal, $reversal_group_ids);

        array_multisort($reversal_group_priority, SORT_DESC, SORT_NUMERIC, $counts_self, SORT_ASC, SORT_NUMERIC, $counts_others_weighted, SORT_ASC, SORT_NUMERIC, $hashed_ids, SORT_ASC, SORT_NUMERIC, $reversal_group_priority, $counts_self, $counts_others_weighted, $hashed_ids, $ids);

    } else {
        array_multisort($counts_self, SORT_ASC, SORT_NUMERIC, $counts_others_weighted, SORT_ASC, SORT_NUMERIC, $hashed_ids, SORT_ASC, SORT_NUMERIC, $counts_self, $counts_others_weighted, $hashed_ids, $ids);
    }

    $pairing_id = reset($ids);
    $pairing = badgePairingInfo($cid, $pairing_id);
    $pairing['type'] = 'badge';

    $badge_1 = badgeInfo($cid, $pairing['badge_id_1']);
    $badge_2 = badgeInfo($cid, $pairing['badge_id_2']);

    $pairing['badge_1'] = $badge_1;
    $pairing['badge_2'] = $badge_2;

    if ($salted_hash_int($pairing_id) & 1) {
        $pairing['display_order'] = '21';
    } else {
        $pairing['display_order'] = '12';
    }

    return $pairing;
}

function getFirstJudgement($cid, $id, $survey_id, $judgement_type)
{
    $stmt = $cid->prepare("SELECT pairing_id FROM `judgement` WHERE judge_id = ? AND survey_id = ? AND judgement_type = ? ORDER BY `timestamp` ASC LIMIT 1");
    $stmt->bind_param('sss', $id, $survey_id, $judgement_type);
    $stmt->execute();
    $result = $stmt->get_result();
    $judgement = $result->fetch_assoc();
    $stmt->close();
    return $judgement;
}

function getUnmatchedReversalGroupId($cid, $id, $survey_id, $judgement_type)
{
    $first_judgement = getFirstJudgement($cid, $id, $survey_id, $judgement_type);

    if ($first_judgement) {
        $first_judgement_id = $first_judgement['pairing_id'];
    } else {
        $first_judgement_id = 0;
    }

    $stmt = $cid->prepare("SELECT MIN(pairing_id) AS pairing_id_min, MAX(pairing_id) AS pairing_id_max, reversal_group_id, MIN(`timestamp`) as earliest_judgement, COUNT(*) AS group_judgement_count FROM `judgement`
    JOIN (
        SELECT id, badge_pairing.reversal_group_id FROM badge_pairing JOIN
(
SELECT reversal_group_id, COUNT(*) AS reversal_group_size FROM
(
SELECT bp.id, reversal_group_id FROM badge_pairing AS bp
JOIN badge AS b1 ON bp.badge_id_1 = b1.id
JOIN badge AS b2 ON bp.badge_id_2 = b2.id
 WHERE reversal_group_id > 0 AND
 (b1.matching_users > 0 OR b1.matching_users_pilot > 0) AND
(b2.matching_users > 0 OR b2.matching_users_pilot > 0)
) pairings
GROUP BY reversal_group_id) group_size ON badge_pairing.reversal_group_id = group_size.reversal_group_id
WHERE reversal_group_size > 1
    ) pairings ON judgement.pairing_id = pairings.id
    WHERE judge_id = ? AND survey_id = ? AND judgement_type = ? AND pairing_id != ?
    GROUP BY reversal_group_id
    ORDER BY group_judgement_count DESC, earliest_judgement ASC
    LIMIT 1;");
    $stmt->bind_param('ssss', $id, $survey_id, $judgement_type, $first_judgement_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $pairing = $result->fetch_assoc();
    $stmt->close();

    if ($pairing) {
        if ($pairing['group_judgement_count'] == 1) {
            return $pairing['reversal_group_id'];
        }
    }
    return 0;
}

function choosePairing($cid, $id, $survey_id, $judgement_type, $remaining_judgements)
{
    if (!in_array($judgement_type, array('self', 'others'))) {
        return;
    }

    $user = userInfo($cid, $id, $survey_id);
    $numfinished = numfinished($cid, $id, $survey_id, 2);

    $numUnderseenPairings = countUnderseenUserPairings($cid, $id, $survey_id);
    $judge_pictures = ($user['vision'] == 'picture' && $judgement_type == 'self' && $numUnderseenPairings >= $remaining_judgements);

    if ($judge_pictures) {
        return chooseUnderseenUserPairing($cid, $id, $survey_id);
    } else {
        return chooseBadgePairing($cid, $id, $survey_id, $judgement_type, $remaining_judgements);
    }
}

function createBadgeFromUser($cid, $id, $survey_id)
{
    $badge = userInfo($cid, $id, $survey_id);
    $badge['tasks'] = numfinished($cid, $id, $survey_id, 2);
    $badge['piece_rate_schedule'] = getPieceRateSchedule($cid, $badge['piece_rate_schedule']);
    $badge['piece_rate_earnings'] = dollar(totalPieceRateEarnings($badge['piece_rate_schedule'], $badge['tasks'])['number']);
    $badge['bonus_schedule'] = getBonusSchedule($cid, $badge['bonus_schedule']);
    $badge['bonus_earnings'] = dollar(totalBonusEarnings($badge['bonus_schedule'], $badge['tasks'])['number']);
    $badge['profile_picture'] = getImage($cid, $id, $survey_id, $badge['image_token'], 'record');
    if (!$badge['profile_picture'] && $badge['visibility'] == 'badge') {
        $badge['profile_picture'] = getImage($cid, $id, $survey_id, $badge['image_token'], 'verification');
    }
    return $badge;
}

function userIsPaired($cid, $id, $survey_id)
{
    $stmt = $cid->prepare("SELECT COUNT(*) from `user_pairing` WHERE ? IN (user_id_1, user_id_2) AND survey_id = ?");
    $stmt->bind_param('ss', $id, $survey_id);
    $stmt->execute();
    $stmt->bind_result($result);
    $stmt->fetch();
    $stmt->close();
    if ($result == 0) {
        return false;
    }

    return true;
}

function pairUsers($cid, $id_1, $id_2, $survey_id)
{
    if (!userIsPaired($cid, $id_1, $survey_id) && !userIsPaired($cid, $id_2, $survey_id)) {
        $stmt = $cid->prepare("INSERT INTO `user_pairing` (survey_id, user_id_1, user_id_2) VALUES (?, ?, ?)");
        $stmt->bind_param('sss', $survey_id, $id_1, $id_2);
        $stmt->execute();
        $stmt->close();
    }
}

function getUnpairedUsers($cid, $survey_id)
{
    $stmt = $cid->prepare("SELECT * from `user` WHERE survey_id = ? AND visibility = 'badge' AND
    finished_part_2 AND
    EXISTS (SELECT judge_id FROM judgement WHERE judge_id = `user`.id AND survey_id = ?) AND
    NOT EXISTS ( SELECT * FROM user_pairing WHERE survey_id = ? AND (user_id_1 = `user`.id OR user_id_2 = `user`.id) )");
    $stmt->bind_param('sss', $survey_id, $survey_id, $survey_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $unpaired_users = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    return $unpaired_users;
}

function pairUnpairedUsers($cid, $survey_id)
{
    $ids = array();
    $unpaired_users = getUnpairedUsers($cid, $survey_id);
    if ($unpaired_users) {
        $ids = array_column($unpaired_users, 'id');
    }
    $previous_id = null;
    // Using array_values allows proper continuous counting from 0
    foreach (array_values($ids) as $ix => $id) {
        if ($ix % 2 == 1) {
            pairUsers($cid, $previous_id, $id, $survey_id);
        }
        $previous_id = $id;
    }
    return (count($ids) > 1);
}

function countUserPairingJudgements($cid, $id, $survey_id)
{
    $stmt = $cid->prepare("SELECT COUNT(DISTINCT judge_id) from `judgement` WHERE pairing_type = 'user' AND pairing_id = ? AND survey_id = ?");
    $stmt->bind_param('ss', $id, $survey_id);
    $stmt->execute();
    $stmt->bind_result($result);
    $stmt->fetch();
    $stmt->close();
    return $result;
}

function updateJudgementCounter($cid, $user_pairing_id, $survey_id)
{
    $numJudgements = countUserPairingJudgements($cid, $user_pairing_id, $survey_id);
    $stmt = $cid->prepare("UPDATE `user_pairing` SET judgement_counter = ? WHERE id = ? AND survey_id = ?");
    $stmt->bind_param('dss', $numJudgements, $user_pairing_id, $survey_id);
    $stmt->execute();
    $stmt->close();
}

function getUserPairings($cid, $survey_id)
{
    $stmt = $cid->prepare("SELECT * FROM `user_pairing` WHERE survey_id = ?");
    $stmt->bind_param('s', $survey_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $userPairings = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    return $userPairings;
}

function updateBadgesMatchingUsers($cid, $survey_id)
{
    $stmt = $cid->prepare("
    UPDATE badge
INNER JOIN
(SELECT badge.id as id, IFNULL(count_data.matching_users, 0) as matching_users FROM (SELECT *,
          COUNT(*) AS matching_users
   FROM
     (
         SELECT piece_rate_schedule,
             bonus_schedule,
             IFNULL(tasks, 0) AS tasks
      FROM
        (SELECT id,
                survey_id,
                piece_rate_schedule,
                bonus_schedule
         FROM `user`
         WHERE survey_id = ? AND visibility = 'badge'
           AND finished_part_2 ) finished_users
      LEFT JOIN
        (SELECT id,
                COUNT(*) AS tasks
         FROM transcription
         WHERE survey_id = ? AND part = 2
         GROUP BY id) effort ON (finished_users.id = effort.id)
         ) effort_frequency
   GROUP BY piece_rate_schedule,
            bonus_schedule,
            tasks
            ) as count_data
            RIGHT JOIN badge on (badge.social_piece_rate = count_data.piece_rate_schedule AND IFNULL(badge.private_bonus, 0)  = IFNULL(count_data.bonus_schedule, 0) AND badge.tasks = count_data.tasks)
            ) source
ON badge.id = source.id
SET badge.matching_users = source.matching_users;
    ");
    $stmt->bind_param('ss', $survey_id, $survey_id);
    $stmt->execute();
    $stmt->close();
}

function updateDatabase($cid, $survey_id)
{
    pairUnpairedUsers($cid, $survey_id);

    $user_pairings = getUserPairings($cid, $survey_id);
    foreach ($user_pairings as $ix => $user_pairing) {
        updateJudgementCounter($cid, $user_pairing['id'], $survey_id);
    }

    updateBadgesMatchingUsers($cid, $survey_id);
}

function markFinishedPart2($cid, $id, $survey_id)
{
    $stmt = $cid->prepare("UPDATE `user` SET finished_part_2 = 1 WHERE id = ? AND survey_id = ?");
    $stmt->bind_param('ss', $id, $survey_id);
    $stmt->execute();
    $stmt->close();
}

function insertIfNew($cid, $id, $survey_id, $piece_rate_schedule, $bonus_schedule, $visibility, $vision, $image_token, $mturk_code)
{
    if (!userExists($cid, $id, $survey_id) && ctype_alnum($id)) {
        $stmt = $cid->prepare("INSERT INTO `user` (id, survey_id, piece_rate_schedule, bonus_schedule, visibility, vision, image_token, mturk_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param('ssddssss', $id, $survey_id, $piece_rate_schedule, $bonus_schedule, $visibility, $vision, $image_token, $mturk_code);
        $stmt->execute();
        $stmt->close();
    }
}

function makeJudgement($cid, $judge_id, $survey_id, $pairing_type, $pairing_id, $display_order, $judgement, $judgement_type)
{
    $stmt = $cid->prepare("INSERT INTO `judgement` (judge_id, survey_id, pairing_type, pairing_id, display_order, judgement, judgement_type) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('sssssss', $judge_id, $survey_id, $pairing_type, $pairing_id, $display_order, $judgement, $judgement_type);
    $stmt->execute();
    $stmt->close();
}

function getTranscriptions($cid, $id, $survey_id, $part)
{
    $stmt = $cid->prepare("SELECT * FROM `transcription` WHERE id = ? AND survey_id = ? AND part = ? ORDER BY `timestamp` DESC");
    $stmt->bind_param('ssd', $id, $survey_id, $part);
    $stmt->execute();
    $result = $stmt->get_result();
    $transcriptions = array();
    while ($row = $result->fetch_assoc()) {
        foreach ($row as $key => $value) {
            $transcriptions[$key][] = $value;
        }
    }
    $stmt->close();
    return $transcriptions;
}

function getPieceRateSchedule($cid, $id)
{
    $stmt = $cid->prepare("SELECT * FROM piece_rate_schedule WHERE id = ? ORDER BY level_threshold ASC");
    $stmt->bind_param('d', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $schedule = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    return $schedule;
}

function getBonusSchedule($cid, $id)
{
    if (!$id) {
        return array();
    }
    $stmt = $cid->prepare("SELECT * FROM bonus_schedule WHERE id = ? ORDER BY level_threshold ASC");
    $stmt->bind_param('d', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $schedule = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    return $schedule;
}

function dollar($number)
{
    if ($number == 0) {
        return $number;
    }
    return number_format((float) $number, 2, '.', '');
}

function insert_transcription($cid, $id, $survey_id, $part, $index, $answer_key, $transcription)
{
    $stmt = $cid->prepare("INSERT INTO transcription (id, survey_id, part, transcription_index, correct_text, text) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('ssddss', $id, $survey_id, $part, $index, $answer_key, $transcription);
    $stmt->execute();
    $stmt->close();
}

function numfinished($cid, $id, $survey_id, $part)
{
    $transcriptions = getTranscriptions($cid, $id, $survey_id, $part);
    if (!$transcriptions) {
        $numfinished = 0;
    } else {
        $numfinished = sizeof($transcriptions['transcription_index']);
    }
    return $numfinished;
}

function totalPieceRateEarnings($schedule, $numfinished)
{
    if (sizeof($schedule) == 0) {
        return array("number" => 0, "html" => '');
    } else {
        $constant_piece_rate_schedule = sizeof($schedule) == 1;
        $stock = $numfinished;
        $total_earnings = 0;
        $html = '';
        foreach ($schedule as $ix => $level) {
            if ($stock > 0) {
                if ($ix == sizeof($schedule) - 1) {
                    $tasks_at_level = $stock;
                } else {
                    $tasks_at_level = min($stock, $schedule[$ix + 1]['level_threshold'] - $level['level_threshold']);
                }
                if ($ix > 0) {
                    $html .= ' + ';
                }

                if ($constant_piece_rate_schedule) {
                    $html .= implode('', array('<span class="constant-piece-rate">',
                        $tasks_at_level, ' x $', dollar($level['piece_rate']),
                        '</span>'));
                } else {
                    $html .= implode('', array('<span class="level level-', $ix + 1, '">',
                        $tasks_at_level, ' x $', dollar($level['piece_rate']),
                        '</span>'));
                }
                $total_earnings += $level['piece_rate'] * $tasks_at_level;
                $stock -= $tasks_at_level;
            }
        }
        $html .= ' = <span style="text-decoration: underline;">$';
        $html .= dollar($total_earnings);
        $html .= '</span>';

        return array("number" => $total_earnings, "html" => $html);
    }
}

function totalBonusEarnings($schedule, $numfinished)
{
    $bonus_level = getBonusLevel($schedule, $numfinished);
    if ($bonus_level == 1) {
        $total_earnings = 0;
        $html = '<span style="text-decoration: underline;">$';
        $html .= dollar($total_earnings);
        $html .= '</span>';
    } else if ($bonus_level == 2) {
        $total_earnings = $schedule[0]['amount'];
        $html = '<span style="text-decoration: underline;">$';
        $html .= dollar($total_earnings);
        $html .= '</span> (Bonus 1)';
    } else {
        $total_earnings = 0;
        $html = '';
        foreach ($schedule as $ix => $level) {
            if ($numfinished >= $level['level_threshold']) {
                if ($ix > 0) {
                    $html .= ' + ';
                }

                $html .= implode('', array('<span class="bonus-', $ix + 1, '">',
                    '$', dollar($level['amount']), ' (Bonus ', $ix + 1, ')',
                    '</span>'));

                $total_earnings += $level['amount'];
            }
        }
        $html .= ' = <span style="text-decoration: underline;">$';
        $html .= dollar($total_earnings);
        $html .= '</span>';
    }
    return array("number" => $total_earnings, "html" => $html);
}

function BonusProgressBar($schedule, $context = null, $progress = 0, $maximum = 100)
{
    $html = '<style>';
    if ($maximum > 30) {
        $label_step_size = 10;
    } else if ($maximum > 10) {
        $label_step_size = 5;
    } else if ($maximum <= 10) {
        $label_step_size = 1;
    }
    for ($i = 0; $i <= floor($maximum / $label_step_size); $i++) {
        $label = $label_step_size * $i;
        $html .= "

    .axislabel.label-$label {
        left: " . ($label / $maximum * 100) . "%;
    }";
    }
    foreach ($schedule as $ix => $value) {
        $level = $ix + 1;
        $threshold = $value['level_threshold'];
        if ($threshold % $label_step_size != 0) {
            $html .= "

    .axislabel.label-$threshold {
        left: " . ($threshold / $maximum * 100) . "%;
    }";
        }
        $html .= "

    .progressbar div.bonus.level-$level.threshold-$threshold {
        left: " . ($threshold / $maximum * 100) . "%;
    }";
    }

    $html .= '</style>';
    $html .= '<div class="progressbararea ' . $context . '">';
    $html .= '<div class="progressbar">';
    foreach ($schedule as $ix => $value) {
        $level = $ix + 1;
        $threshold = $value['level_threshold'];
        $amount = dollar($value['amount']);
        $html .= "<div class='bonus level level-$level threshold-{$value['level_threshold']}";
        if ($progress >= $value['level_threshold']) {
            $html .= " completed";
        }
        $html .= "'><p>";
        if ($context == 'task part-2') {
            $html .= "Bonus";
            if (count($schedule) > 1) {
                $html .= " $level";
            }
            $html .= "<br>";
        }
        $html .= "+$$amount</p><div class='bonusline level level-$level";
        if ($threshold == 0) {
            $html .= " at-minimum";
        }
        $html .= "'>";
        $html .= "</div></div>";
        if ($threshold % $label_step_size != 0) {
            $html .= "<div class='axislabel label-$threshold bonuslabel'>$threshold";
            $html .= "</div>";
        }
    }
    $html .= '<progress class="task" max="' . $maximum . '" value="' . $progress . '"></progress>';
    for ($i = 0; $i <= floor($maximum / $label_step_size); $i++) {
        $label = $label_step_size * $i;
        $html .= "<div class='axislabel label-$label";
        if (in_array($label, getBonusThresholds($schedule))) {
            $html .= " bonuslabel";
        }
        $html .= "'>$label";
        if ($i > 0 && $i <= floor(($maximum - 1) / $label_step_size)) {
            $html .= "<div class='axisline'></div>";
        }
        $html .= "</div>";
    }
    $html .= '</div></div>';
    return $html;
}

function getPieceRateLevel($schedule, $numfinished)
{
    $level = 0;
    foreach ($schedule as $key => $value) {
        if (($numfinished + 1) >= $value['level_threshold']) {
            $level += 1;
        }
    }
    return $level;
}

function getBonusLevel($schedule, $numfinished)
{
    $level = 1;
    foreach ($schedule as $key => $value) {
        if ($numfinished >= $value['level_threshold']) {
            $level += 1;
        }
    }
    return $level;
}

function sanitizePath($str)
{
    return preg_replace("/[^a-zA-Z0-9_]+/", "", $str);
}

function storeImage($cid, $id, $survey_id, $image_token, $subfolder, $capture_counter, $load_verification_counter, $post_image)
{
    // Sanitize inputs
    $id = sanitizePath($id);
    $survey_id = sanitizePath($survey_id);
    $image_token = sanitizePath($image_token);
    $subfolder = sanitizePath($subfolder);
    $capture_counter = sanitizePath($capture_counter);
    $load_verification_counter = sanitizePath($load_verification_counter);

    if ($post_image['size'] < 10 * 1024) {
        echo "Error uploading image (code 1)";
    } elseif (userExists($cid, $id, $survey_id)) {
        $dir = "./webcam_images/{$survey_id}/{$subfolder}";
        $file = $dir . '/' . $id . '_' . $image_token . '_' . $capture_counter . '_' . $load_verification_counter . '_' . date("Y-m-d_H-i") . ".png"; // One picture per minute
        if (move_uploaded_file($post_image['tmp_name'], $file)) {
            echo 0;
        } else {
            echo "Error uploading image (code 2)";
        }
    } else {
        echo "Error uploading image (code 3)";
    }
}

function getImage($cid, $id, $survey_id, $image_token, $subfolder)
{
    // Sanitize inputs
    $id = sanitizePath($id);
    $survey_id = sanitizePath($survey_id);
    $image_token = sanitizePath($image_token);
    $subfolder = sanitizePath($subfolder);

    if (userExists($cid, $id, $survey_id) &&
        ctype_alnum($image_token) &&
        ctype_alnum($id) &&
        strlen($image_token) == 16) {
        $images = glob("webcam_images/{$survey_id}/{$subfolder}/{$id}_{$image_token}_*.png");
        if (!$images) {
            return;
        }
        rsort($images);
        $path = $images[0];
        $filetype = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        $profile_picture = 'data:image/' . $filetype . ';base64,' . base64_encode($data);
        return $profile_picture;
    }
}

function anonymizeId($id)
{
    $length = strlen($id);
    $anonmization_start = max(0, min(2, $length - 4));
    $anonmization_length = max(4, $length - $anonmization_start - 4);
    return substr_replace($id, str_repeat('•', $anonmization_length), $anonmization_start, $anonmization_length);
}
/**
 * Generate a random string, using a cryptographically secure
 * pseudorandom number generator (random_int)
 *
 * This function uses type hints now (PHP 7+ only), but it was originally
 * written for PHP 5 as well.
 *
 * For PHP 7, random_int is a PHP core function
 * For PHP 5.x, depends on https://github.com/paragonie/random_compat
 *
 * @param int $length      How many characters do we want?
 * @param string $keyspace A string of all possible characters
 *                         to select from
 * @return string
 */
function random_str(
    int $length = 64,
    string $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
): string {
    if ($length < 1) {
        throw new \RangeException("Length must be a positive integer");
    }
    $pieces = [];
    $max = strlen($keyspace) - 1;
    for ($i = 0; $i < $length; ++$i) {
        $pieces[] = $keyspace[random_int(0, $max)];
    }
    return implode('', $pieces);
}
