import { Fragment } from "react"
import styles from "./index.module.scss"

const FeaturedProduct = ({ schema, template }) => {
  return (
    <Fragment>
      <section
        data-section-id={`{{ section.id }}`}
        data-section-type={`featured-product`}
        className={styles.featuredProduct}
        dangerouslySetInnerHTML={{ __html: template.default }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: `{% schema %}${schema}{% endschema %}`,
        }}
      />
    </Fragment>
  )
}

FeaturedProduct.getInitialProps = async () => {
  const schema = JSON.stringify(require("./schema.json"))
  const template = require("./template.liquid")
  const pageProps = {
    schema,
    template,
  }
  return pageProps
}

export default FeaturedProduct
