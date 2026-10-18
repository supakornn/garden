import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import Darkmode from "./Darkmode"
import { concatenateResources } from "../util/resources"

const ThemeToggle = Darkmode()

const PageTitle: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, cfg, displayClass } = props
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class={classNames(displayClass, "site-header")}>
      <div class="site-header-top">
        <div class="site-brand">
          <h2 class="page-title">
            <a href={baseDir}>{title}</a>
          </h2>
          <a
            href="https://webring.wonderful.software#supakorn.me"
            title="วงแหวนเว็บ"
            class="webring-link"
          >
            <img
              alt="วงแหวนเว็บ"
              width="22"
              height="22"
              src="https://webring.wonderful.software/webring.black.svg"
              class="webring-light"
            />
            <img
              alt="วงแหวนเว็บ"
              width="22"
              height="22"
              src="https://webring.wonderful.software/webring.white.svg"
              class="webring-dark"
            />
          </a>
        </div>
        <ThemeToggle {...props} />
      </div>
      <nav aria-label="Site links">
        <a href="https://github.com/supakornn">github</a>
        <a href="https://www.linkedin.com/in/supakornieamgomol/">linkedin</a>
        <a href="https://www.instagram.com/supakornigm/">instagram</a>
        <a href="https://www.facebook.com/supakornigm/">facebook</a>
        <a href="https://resume.supakorn.me">resume</a>
      </nav>
    </div>
  )
}

PageTitle.beforeDOMLoaded = ThemeToggle.beforeDOMLoaded

PageTitle.css = concatenateResources(
  ThemeToggle.css,
  `
.site-header {
  width: 100%;
}

.site-header-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.site-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.25;
}

.site-header nav {
  color: var(--gray);
  font-family: var(--codeFont);
  font-size: 0.8rem;
}

.site-header nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.1rem;
  margin-top: 0.25rem;
}

.site-header nav a {
  color: var(--gray);
  font-weight: 400;
}

@media (max-width: 800px) {
  .site-header nav {
    column-gap: 0.85rem;
  }
}

.webring-link {
  display: inline-flex;
  opacity: 0.55;
}

.webring-link:hover {
  opacity: 1;
}

.webring-link img {
  display: block;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.webring-link:hover img {
  transform: rotate(360deg);
}

:root[saved-theme="dark"] .webring-light { display: none; }
:root:not([saved-theme="dark"]) .webring-dark { display: none; }
`,
)

export default (() => PageTitle) satisfies QuartzComponentConstructor
