// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Glueops",
  tagline: "Dataops and Devops platform",
  url: "https://glueops.dev/",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "images/glueops.png",
  organizationName: "Glueops",
  projectName: "website",
  deploymentBranch: "master",
  trailingSlash: false,
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/GlueOps/glueops-dev",
          sidebarCollapsed: false,
        },
        theme: {
          customCss: [require.resolve("./src/css/custom.css"), require.resolve("./src/css/helpers.css")],
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({

      colorMode: {
        defaultMode: "light",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      metadata: [
        { name: "keywords", content: "devops, dataops, gitops, workflow, glueops," },
        {
          name: "description",
          content:
            "GlueOps simplifies and optimizes your business’s DevOps and DataOps operations, allowing for efficient management and operation.",
        },
        { name: "og:image", content: "https://glueops.dev/images/glueops.png" },
      ],
      navbar: {
        title: "Glueops",
        logo: {
          alt: "Glueops Logo",
          src: "images/glueops.png",
          srcDark: "images/glueops.png",
        },
        items: [
          {
            type: "doc",
            docId: "introduction",
            position: "left",
            label: "Docs",
          },
          {
            type: "doc",
            docId: "getting-started",
            position: "left",
            label: "Get Started",
          },
      
          // },
          // {
          //   href: "https://nx.dev",
          //   className: "header-nxdev-link",
          //   "aria-label": "Nx documentation",
          //   position: "right",
          //   title: "Check Nx",
          //   label: "Nx",
          // },
          // {
          //   href: "https://nx.app",
          //   className: "header-nxdev-link",
          //   "aria-label": "Nx Cloud",
          //   position: "right",
          //   title: "Check Nx Cloud",
          //   label: "Nx Cloud",
          // },
          // {
          //   href: "https://nrwl.io",
          //   className: "header-nrwlio-link",
          //   "aria-label": "Nrwl consulting",
          //   position: "right",
          //   title: "Check Nrwl",
          //   label: "Nrwl",
          // },
          {
            href: "https://github.com/GlueOps/glueops-dev",
            className: "header-github-link",
            "aria-label": "GitHub repository",
            position: "right",
            title: "Glueops on Github",
          },
        ],
        hideOnScroll: true,
      },
      footer: {
        links: [
          {
            title: "Address",
            items: [
              {
                html: `
                    <p>
                    GlueOps, LLC<br>
                    35 N Franklin Ave<br>
                    Ste 687 2062<br>
                    Pinedale, WY 82941
                    </p>
                  `,
              },
            ],
          },
          {
            title: "Resources",
            items: [
              {
                label: "Docs",
                to: "#",
              },
              {
                label: "Purchase DataOps on Amazon Marketplace",
                to: "https://aws.amazon.com/marketplace/pp/prodview-mfwjl2qdvhaes?sr=0-1&ref_=beagle&applicationId=AWSMPContessa",
              },
              {
                label: "Purchase DevOps on Amazon Marketplace",
                to: "https://aws.amazon.com/marketplace/pp/prodview-soaz2d3nlms6k?sr=0-2&ref_=beagle&applicationId=AWSMPContessa",
              },
            ],
          },
          
        ],
        copyright: `Released under the MIT License. <br /> &copy; ${new Date().getFullYear()} Copyright Nx.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
