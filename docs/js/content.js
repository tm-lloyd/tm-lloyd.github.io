const academicContent = {
  publications: [
    {
      id: 'pub1',
      title: 'Are People Willing to Pay for Reduced Inequality?',
      authors: [
        {
          name: 'Thomas Lloyd',
          url: null
        },
        {
          name: 'Brian Hill',
          url: 'https://people.hec.edu/hill/'
        }
      ],
      journal: 'Management Science',
      year: '2025',
      url: 'https://pubsonline.informs.org/doi/abs/10.1287/mnsc.2023.01974',
      workingPaperUrl: 'https://people.hec.edu/hill/wp-content/uploads/sites/25/2021/11/WTPRII_0623.pdf',
      workingPaperText: 'Working Paper Version, June 2023',
      abstract: 'Would consumers be willing to pay more for goods for which there is less inequality in wages across those involved in their production? In incentive-compatible behavioural choice studies on representative samples of the English and US populations, we find significantly positive willingness to pay for such inequality reductions in over 80% of subjects. Whilst it varies with political leaning and the extent of the inequality reduction, willingness to pay is positive across the political spectrum and for all studied inequality differences. It is higher for more intuitive and informative inequality-reporting formats. Our findings have policy implications for both governments and firms. On the one hand, they suggest the promise of universal provision of product-level inequality information as a tool for moderating income inequality. On the other, they highlight the potential relevance of inequality reporting for firms\' marketing strategies.',
      image: './jpg/WTP_fig4.png'
    }
  ],
  workingPapers: [
    {
      id: 'wp1',
      title: 'The Long Shadow of Early Education: Evidence from a Natural Experiment in the Philippines',
      authors: [
        {
          name: 'Thomas Lloyd',
          url: null
        },
        {
          name: 'Dean Yang',
          url: 'https://deanyang-econ.github.io/deanyang/'
        }
      ],
      url: '/pdf/lloyd_yang_2025_long_shadow_education.pdf',
      nberUrl: 'https://www.nber.org/papers/w33600',
      nberText: 'NBER Working Paper No. 33600',
      date: 'March 2025',
      isNew: true,
      presentation: 'Presented at the North East Universities Development Consortium (NEUDC) 2024 Conference',
      abstract: 'How does early educational quality affect longer-term academic outcomes? We shed light on this question via a natural experiment in the Philippines—the flawed implementation of a mother tongue education policy in public schools in kindergarten to Grade 3. This policy led to an unexpected decline in educational quality, but differentially in a subset of schools strongly predicted by pre-policy student language composition. We use language composition variables as instrumental variables for treatment. Leveraging panel data and confirming robustness to pre-trends, we find that the policy led to declines in standardized test scores in public primary schools. Employing a triple-difference strategy with Philippine Census data (across cohorts, localities, and decadal censuses), we show that by 2020, cohorts fully exposed to the policy completed 0.3 fewer years of schooling. By revealing how a policy-induced reduction in early education quality reduces educational attainment in later years, our results underscore the importance of investing in the quality of education in the first years of schooling.',
      image: './jpg/coefplot_TD_educ_munic_x_age_x_census20102020_pafe_moi.png'
    }
  ],
  workInProgress: [
    {
      id: 'wip1',
      title: 'Does It Matter That Carbon Taxes Are Regressive?',
      authors: [
        {
          name: 'Thomas Lloyd',
          url: null
        },
        {
          name: 'Ashley C. Craig',
          url: 'https://ashleycraig.com/'
        },
        {
          name: 'Dylan T. Moore',
          url: 'https://www.dylantmoore.com/'
        }
      ],
      abstract: 'We ask how externalities should be taxed when redistribution is costly. In our model, the government raises revenue using distortionary income and commodity taxes. If more or less productive people have identical tastes for an externality-generating activity, the government optimally imposes a Pigouvian tax equal to the marginal damage from the externality. This is true regardless of whether the tax is regressive. But, if regressivity partly reflects different preferences of people with different incomes, the tax optimally deviates from the Pigouvian benchmark because this helps redistribute income efficiently. The overall tax may be higher or lower, and may even reverse sign relative to the externality. We derive sufficient statistics for optimal policy, and use them to study carbon taxation in the United States. Throughout most of the income distribution, our empirical results imply an optimal carbon tax below marginal damage, but this reverses for very high-earning households. When we allow for heterogeneity in preferences at each income level as well as across the income distribution, our optimal tax schedules are attenuated toward the Pigouvian benchmark.'
    },
    {
      id: 'wip2',
      title: 'Colonizer Identity and Economic Development: Evidence from the Scramble for Africa',
      authors: [
        {
          name: 'Thomas Lloyd',
          url: null
        },
        {
          name: 'Laston Manja',
          url: null
        }
      ],
      abstract: 'This paper examines the long run economic impacts of differential European colonial rule in Africa, by exploiting differences arising from the arbitrary borders established during the Scramble for Africa (1876-1912). Using a regression discontinuity design along the full set of British/French colonial borders, I explore the impact of colonizer identity on measures of economic development. I find persistent effects of the legacy of colonial institutions, with areas formerly under British rule exhibiting higher nighttime light intensity and lower malaria prevalence at the grid cell level relative to areas formerly under French colonial rule. Additionally, at the individual level, these areas display higher educational attainment, lower unemployment rates, and improved public good provision. I explore mechanisms and find evidence in support of sharp discontinuities in formal institutions at the border, such as the structure of property rights and the quality of government, as opposed to informal institutions such as proxies for entrepreneurship and the prevalence of Protestantism.'
    },
    {
      id: 'wip3',
      title: 'Garage Churches, Poverty, and Crime: Evidence from Colombian Cities',
      authors: [
        {
          name: 'Thomas Lloyd',
          url: null
        },
        {
          name: 'Juan P. Aparicio',
          url: 'https://www.posadaaparicio.com/research'
        },
        {
          name: 'María Medellín Esguerra',
          url: 'https://mariamedellin.com/'
        }
      ],
      abstract: null
    }
  ]
};

class AcademicContentRenderer {
  constructor() {
    this.toggleCounter = 0;
  }

  renderSection(sectionData, sectionTitle, options = {}) {
    const { showImages = false, expandAbstracts = false } = options;
    
    if (!sectionData || sectionData.length === 0) return '';
    
    let html = `<h2 id="${sectionTitle.toLowerCase().replace(/\s+/g, '')}">${sectionTitle}</h2>\n`;
    
    sectionData.forEach((item, index) => {
      html += this.renderItem(item, { showImages, expandAbstracts });
      if (index < sectionData.length - 1) {
        html += '<hr>\n';
      }
    });
    
    return html;
  }

  renderItem(item, options = {}) {
    const { showImages = false, expandAbstracts = false } = options;
    let html = '';
    
    html += this.renderTitle(item);
    html += this.renderAuthors(item.authors);
    html += this.renderJournal(item);
    html += this.renderAdditionalInfo(item);
    html += this.renderAbstract(item, expandAbstracts);
    html += this.renderImage(item, showImages);
    
    return html;
  }

  renderTitle(item) {
    if (item.url) {
      return `<h3 style="margin:20px 0 5px;"><a href="${item.url}" target="_blank">${item.title}</a></h3>\n`;
    }
    return `<h3 style="margin:20px 0 5px;">${item.title}</h3>\n`;
  }

  renderAuthors(authors) {
    if (!authors || authors.length === 0) return '';
    
    // Filter out Thomas Lloyd from the co-authors list
    const coAuthors = authors.filter(author => author.name !== 'Thomas Lloyd');
    
    if (coAuthors.length === 0) return '';
    
    const authorLinks = coAuthors.map(author => {
      if (author.url) {
        return `<a href="${author.url}" target="_blank">${author.name}</a>`;
      }
      return author.name;
    });
    
    const authorsText = authorLinks.join(' & ');
    return `<p style="margin:0 0 5px;">(with ${authorsText})</p>\n`;
  }

  renderJournal(item) {
    if (!item.journal) return '';
    return `<p style="margin:0 0 5px;"><em>${item.journal}, ${item.year}</em></p>\n`;
  }

  renderAdditionalInfo(item) {
    let html = '';
    
    if (item.workingPaperUrl) {
      html += `<p style="margin:0 0 5px;"><em><a href="${item.workingPaperUrl}" target="_blank">[${item.workingPaperText}]</a></em></p>\n`;
    }
    
    if (item.nberUrl) {
      const newLabel = item.isNew ? '<b>NEW!</b> ' : '';
      html += `<p style="margin:0 0 5px;"><em>${newLabel}<a href="${item.nberUrl}" target="_blank">${item.nberText}</a></em>, ${item.date}</p>\n`;
    }
    
    if (item.presentation) {
      html += `<p style="margin:0 0 5px;"><em>${item.presentation}</em></p>\n`;
    }
    
    return html;
  }

  renderAbstract(item, expandAbstracts) {
    if (!item.abstract) return '';
    
    if (expandAbstracts) {
      return `<p style="margin:0 0 5px;">${item.abstract}</p>\n`;
    } else {
      const toggleId = this.toggleCounter++;
      return `<p style="margin:0 0 5px;"><a href="javascript:toggle(${toggleId})" role="button" aria-expanded="false" aria-controls="pubabs_${toggleId}">Abstract<span id="pubabslink_${toggleId}"> (click to expand)</span></a><span id="pubabs_${toggleId}" style="display:none;" aria-hidden="true"> (–): ${item.abstract}</span></p>\n`;
    }
  }

  renderImage(item, showImages) {
    if (!showImages || !item.image) return '';
    const altText = `Figure from "${item.title}"`;
    
    // Special sizing for Long Shadow education paper image
    let imageStyle = "max-width: 100%; height: auto; display: block; margin: 10px 0;";
    if (item.image.includes('coefplot_TD_educ_munic_x_age_x_census20102020_pafe_moi.png')) {
      imageStyle = "max-width: 80%; height: auto; display: block; margin: 10px auto;";
    }
    
    return `<img src="${item.image}" alt="${altText}" style="${imageStyle}" loading="lazy">\n`;
  }

  renderAll(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = '';
    
    if (academicContent.publications.length > 0) {
      html += this.renderSection(academicContent.publications, 'Publications', options);
      html += '<hr>\n';
    }
    
    if (academicContent.workingPapers.length > 0) {
      html += this.renderSection(academicContent.workingPapers, 'Working Papers', options);
      html += '<hr>\n';
    }
    
    if (academicContent.workInProgress.length > 0) {
      html += this.renderSection(academicContent.workInProgress, 'Work in Progress', options);
    }
    
    container.innerHTML = html;
  }
}

function toggle(pid) {
  const objid = "pubabs_" + pid.toString();
  const linkid = "pubabslink_" + pid.toString();
  const absobj = document.getElementById(objid);
  const linkobj = document.getElementById(linkid);
  const button = document.querySelector(`[aria-controls="${objid}"]`);
  
  if (absobj.style.display === "none") {
    absobj.style.display = "inline";
    absobj.setAttribute('aria-hidden', 'false');
    linkobj.style.display = "none";
    if (button) button.setAttribute('aria-expanded', 'true');
  } else {
    absobj.style.display = "none";
    absobj.setAttribute('aria-hidden', 'true');
    linkobj.style.display = "inline";
    if (button) button.setAttribute('aria-expanded', 'false');
  }
}

window.academicContent = academicContent;
window.AcademicContentRenderer = AcademicContentRenderer;