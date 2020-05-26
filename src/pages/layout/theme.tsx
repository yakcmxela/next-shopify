import { Fragment } from "react"
import Head from "next/head"

const Theme = () => {
  return (
    <Fragment>
      <head>{`{{ content_for_header }}`}</head>
      <main role="main">{`{{ content_for_layout }}`}</main>
    </Fragment>
  )
}

export default Theme
