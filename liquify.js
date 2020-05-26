const fs = require("fs")
const extra = require("fs-extra")
const Promise = require("bluebird")

const dir = `${__dirname}/out`
const outs = ["", "layout", "sections", "templates"]
const renames = []

const read = async (subdir) => {
  const fullPath = `${dir}/${subdir}`
  try {
    const files = await fs.readdirSync(fullPath)
    files.forEach((file) => {
      const split = file.split(".")
      if (split[split.length - 1] === "html") {
        split[split.length - 1] = "liquid"
        renames.push({
          current: `${fullPath}/${file}`,
          expected: `${fullPath}/${split.join(".")}`,
        })
      }
    })
  } catch (error) {
    console.log(error)
  }
}

const liquify = () => {
  Promise.map(renames, async (target) => {
    try {
      const file = await fs.readFileSync(target.current, { encoding: `UTF-8` })
      const srcs = file.match(/src="\/\_next(.*?)"/)
      const hrefs = file.match(/href="\/\_next(.*?)"/)
      const srcsSplit = srcs[1].split("/")
      const hrefsSplit = hrefs[1].split("/")
      const lastSrc = srcsSplit[srcsSplit.length - 1]
      const lastHref = hrefsSplit[hrefsSplit.length - 1]
      await file.replace(new RegExp(srcs[1]), lastSrc)
      await file.replace(new RegExp(hrefs[1]), lastHref)
      console.log(srcs[1])
      console.log(file)
      await fs.renameSync(target.current, target.expected)
    } catch (error) {
      console.log(error)
    }
  })
    .catch((error) => {
      console.log(error)
    })
    .done(async () => {
      await fs.renameSync(
        `${dir}/index.liquid`,
        `${dir}/templates/index.liquid`
      )
      await fs.renameSync(`${dir}/404.liquid`, `${dir}/templates/404.liquid`)
      console.log("Files successfully converted to liquid.")
    })
}

const init = async () => {
  Promise.map(outs, async (out) => {
    try {
      await read(out)
    } catch (error) {
      console.log(error)
    }
  })
    .catch((error) => {
      console.log(error)
    })
    .then(async () => {
      try {
        await liquify()
        await modules()
      } catch (error) {
        console.log(error)
      }
    })
}

init()
