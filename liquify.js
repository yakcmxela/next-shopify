const fs = require("fs")
const extra = require("fs-extra")
const Promise = require("bluebird")

const dir = `${__dirname}/out`
const outs = ["", "layout", "sections", "templates"]
const renames = []

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
        // await modules()
      } catch (error) {
        console.log(error)
      }
    })
}

const liquify = () => {
  Promise.each(renames, async (target) => {
    try {
      const file = await fs.readFileSync(target.current, { encoding: `UTF-8` })
      const hrefs = file.match(new RegExp(/href="\/\_next(.*?)"/, "g"))
      const srcs = file.match(new RegExp(/src="\/\_next(.*?)"/, "g"))
      await extra.ensureDirSync(`${dir}/assets`)
      let newFile = file
      newFile = await moveAndRename(dir, hrefs, newFile, "href")
      newFile = await moveAndRename(dir, srcs, newFile, "src")
      const schema = file.match(new RegExp(/{% schema %}(.*?){% endschema %}/))
      if (schema) {
        newFile.replace(new RegExp(schema[1], ""))
      }
      await fs.writeFileSync(target.current, newFile)
      await fs.renameSync(target.current, target.expected)
      // await extra.removeSync(`${dir}/_next`)
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

const moveAndRename = async (dir, arr, file, type) => {
  let newFile = file
  for (const i in arr) {
    const filePath = arr[i].match(/"((?:\\.|[^"\\])*)"/)[1]
    const split = filePath.split("/")
    newFile = newFile.replace(
      new RegExp(arr[i], "g"),
      `${type}="{{ '${split[split.length - 1]}' | asset_url }}"`
    )
    const pathExists = await extra.pathExistsSync(`${dir}${filePath}`)
    if (pathExists) {
      await extra.moveSync(
        `${dir}${filePath}`,
        `${dir}/assets/${split[split.length - 1]}`
      )
    }
  }
  return newFile
}

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

init()
