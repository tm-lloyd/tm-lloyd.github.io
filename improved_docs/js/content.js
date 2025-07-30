/*
 * Structured content for the Thomas Lloyd website.  This file defines
 * all of the bio text, publications, working papers and works in
 * progress.  By keeping all of the textual content in one place we
 * avoid duplication between the home and research pages and make it
 * straightforward to update the site in the future.
 */

// Top‑level container for all page content.  Each key corresponds
// to a section rendered on the site.  When editing the website you
// only need to modify the values below – the page layout will
// automatically adjust via main.js.
const contentData = {
  // Short biography.  You can include HTML anchors here.  The
  // biography is displayed on the home page above the list of
  // publications.
  bio: `
    <p>I am a 4th year PhD candidate in the Department of Economics at the <a
      href="https://lsa.umich.edu/econ/people/faculty.directory.html" target="_blank">University of Michigan</a>.
      My research interests span Development Economics and Public Economics with a focus on education,
      inequality, externalities, and the design and evaluation of public policies.</p>
    <p>I previously worked as a research assistant at <a href="https://crest.science/" target="_blank">CREST</a>,
      the Department of Economics of Ecole Polytechnique and ENSAE.  I hold master's degrees from
      Ecole Polytechnique and <a href="https://www.hec.edu/en/faculty-research/faculty-departments/economics-and-decision-sciences" target="_blank">HEC Paris</a>,
      and completed my undergraduate degree at the <a href="https://www.tse-fr.eu/" target="_blank">Toulouse School of Economics</a>.</p>
  `,
  // Path to the latest CV on the site.  When updating the CV, change
  // this path and the button on the site will automatically link to
  // the new file.
  cvPath: './pdf/CV_02212025.pdf',
  // Peer‑reviewed publications.  Each entry should include at least
  // a title and authors.  Optional fields include journal,
  // abstract, link and extras.  Extras is an array of objects with
  // text and link properties which will be rendered beneath the
  // journal line (e.g., links to working paper versions or data
  // repositories).
  publications: [
    {
      title: 'Are People Willing to Pay for Reduced Inequality?',
      link: 'https://pubsonline.informs.org/doi/abs/10.1287/mnsc.2023.01974',
      authors: '(with <a href="https://people.hec.edu/hill/" target="_blank">Brian Hill</a>)',
      journal: 'Management Science, 2025',
      abstract: `Would consumers be willing to pay more for goods for which there is less inequality in wages across those involved in their production? In incentive‑compatible behavioural choice studies on representative samples of the English and US populations, we find significantly positive willingness to pay for such inequality reductions in over 80% of subjects. Whilst it varies with political leaning and the extent of the inequality reduction, willingness to pay is positive across the political spectrum and for all studied inequality differences. It is higher for more intuitive and informative inequality‑reporting formats. Our findings have policy implications for both governments and firms. On the one hand, they suggest the promise of universal provision of product‑level inequality information as a tool for moderating income inequality. On the other, they highlight the potential relevance of inequality reporting for firms’ marketing strategies.`,
      extras: [
        {
          text: '[Working Paper Version, June 2023]',
          link: 'https://people.hec.edu/hill/wp-content/uploads/sites/25/2021/11/WTPRII_0623.pdf'
        }
      ]
    }
  ],
  // Working papers.  These are typically manuscripts that are not yet
  // published in peer‑reviewed journals.  The details field allows
  // you to highlight conference presentations or citations such as
  // NBER working paper numbers.  An optional image can be provided to
  // visually enhance the item.
  workingPapers: [
    {
      title: 'The Long Shadow of Early Education: Evidence from a Natural Experiment in the Philippines',
      link: './pdf/lloyd_yang_2025_long_shadow_education.pdf',
      authors: '(with <a href="https://deanyang-econ.github.io/deanyang/" target="_blank">Dean Yang</a>)',
      details: '<em><b>NEW!</b> <a href="https://www.nber.org/papers/w33600" target="_blank">NBER Working Paper No. 33600</a></em>, March 2025',
      presentation: '<em>Presented at the North East Universities Development Consortium (NEUDC) 2024 Conference</em>',
      abstract: `How does early educational quality affect longer‑term academic outcomes? We shed light on this question via a natural experiment in the Philippines—the flawed implementation of a mother tongue education policy in public schools in kindergarten to Grade 3. This policy led to an unexpected decline in educational quality, but differentially in a subset of schools strongly predicted by pre‑policy student language composition. We use language composition variables as instrumental variables for treatment. Leveraging panel data and confirming robustness to pre‑trends, we find that the policy led to declines in standardised test scores in public primary schools. Employing a triple‑difference strategy with Philippine Census data (across cohorts, localities and decadal censuses), we show that by 2020, cohorts fully exposed to the policy completed 0.3 fewer years of schooling. By revealing how a policy‑induced reduction in early education quality reduces educational attainment in later years, our results underscore the importance of investing in the quality of education in the first years of schooling.`,
      image: './jpg/coefplot_TD_educ_munic_x_age_x_census20102020_pafe_moi.png'
    }
  ],
  // Projects at an earlier stage.  Only titles and authors are
  // necessary, but abstracts can be supplied if available.
  workInProgress: [
    {
      title: 'Does It Matter That Carbon Taxes Are Regressive?',
      authors: '(with <a href="https://ashleycraig.com/" target="_blank">Ashley C. Craig</a> &amp; <a href="https://www.dylantmoore.com/" target="_blank">Dylan T. Moore</a>)',
      abstract: ''
    },
    {
      title: 'Colonizer Identity and Economic Development: Evidence from the Scramble for Africa',
      authors: '',
      abstract: `This paper examines the long‑run economic impacts of differential European colonial rule in Africa by exploiting differences arising from the arbitrary borders established during the Scramble for Africa (1876–1912). Using a regression discontinuity design along the full set of British/French colonial borders, I explore the impact of coloniser identity on measures of economic development. I find persistent effects of the legacy of colonial institutions, with areas formerly under British rule exhibiting higher nighttime light intensity and lower malaria prevalence at the grid cell level relative to areas formerly under French colonial rule. Additionally, at the individual level, these areas display higher educational attainment, lower unemployment rates and improved public good provision. I explore mechanisms and find evidence in support of sharp discontinuities in formal institutions at the border, such as the structure of property rights and the quality of government, as opposed to informal institutions such as proxies for entrepreneurship and the prevalence of Protestantism.`
    },
    {
      title: 'Garage Churches, Poverty, and Crime: Evidence from Colombian Cities',
      authors: '(with <a href="https://www.posadaaparicio.com/research" target="_blank">Juan P. Aparicio</a> &amp; <a href="https://mariamedellin.com/" target="_blank">María Medellín Esguerra</a>)',
      abstract: ''
    }
  ]
};