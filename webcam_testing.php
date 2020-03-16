<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);

// Allow cross origin request from Qualtrics/user
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

//connect to DB
require_once 'utils_testing.php';
require_once 'f_connect_testing.php';

// get all of the "posted" and "get" vars
$variables = array('id', 'survey_id', 'image_token', 'image_type', 'capture_counter', 'load_verification_counter');
foreach ($variables as $var) {
    if (isset($_REQUEST[$var])) {
        $$var = $cid->real_escape_string($_REQUEST[$var]);
    }
}

if (isset($cid, $id, $survey_id, $image_token, $image_type, $capture_counter, $load_verification_counter, $_FILES['webcam_image'])) {
    storeImage($cid, $id, $survey_id, $image_token, $image_type, $capture_counter, $load_verification_counter, $_FILES['webcam_image']);
} else {
    return "Error uploading image (type 4)";
}
