const container =
    "<?xml version=\"1.0\" ?>\n<container version=\"1.0\" xmlns=\"urn:oasis:names:tc:opendocument:xmlns:container\">\n"
    + "  <rootfiles>\n    <rootfile full-path=\"OEBPS/manga.opf\" media-type=\"application/oebps-package+xml\"/>\n  </rootfiles>\n"
    + "</container>";
const package_template =
    "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
    + "<package xmlns=\"http://www.idpf.org/2007/opf\" version=\"3.0\" prefix=\"rendition: http://www.idpf.org/vocab/rendition/#\" unique-identifier=\"uuid\">\n"
    + "  <metadata xmlns:dc=\"http://purl.org/dc/elements/1.1/\">\n{0}"
    + "    <meta property=\"rendition:layout\">pre-paginated</meta>\n"
    + "    <meta property=\"rendition:spread\">auto</meta>\n"
    + "  </metadata>\n"
    + "  <manifest>\n{1}  </manifest>\n  <spine page-progression-direction=\"rtl\">\n{2}  </spine>\n</package>";
const nav_template =
    "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:epub=\"http://www.idpf.org/2007/ops\">\n"
    + "  <head><title>{title}</title></head>\n"
    + "  <body>\n"
    + "    <nav epub:type=\"toc\">\n      <h1>CONTENTS</h1>\n      <ol>\n{0}      </ol>\n    </nav>\n"
    + "    <nav epub:type=\"landmarks\">\n      <h2>Guide</h2>      \n<ol>\n{1}      </ol>\n    </nav>\n"
    + "  </body>\n</html>";
const xhtml_template =
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
    + "<!DOCTYPE html>\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:epub=\"http://www.idpf.org/2007/ops\">"
    + "  <head>\n    <meta charset=\"UTF-8\"/>\n    <title>{title}</title>\n    <meta name=\"viewport\" content=\"width={w}, height={h}\" />\n  </head>"
    + "  <body style=\"margin:0;padding:0;\">\n    <div>\n"
    + "      <svg style=\"margin:0;padding:0;\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"100%\" height=\"100%\" viewBox=\"0 0 {w} {h}\">\n"
    + "        <image width=\"{w}\" height=\"{h}\" xlink:href=\"{href}\"/>\n"
    + "      </svg>\n    </div>\n  </body>\n</html>";
const xhtml_placeholder =
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
    + "<!DOCTYPE html>\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:epub=\"http://www.idpf.org/2007/ops\">"
    + "<head>\n  <meta charset=\"UTF-8\"/>\n  <title>{title}</title>\n  <meta name=\"viewport\" content=\"width=1000, height=1414\" />\n</head>"
    + "<body style=\"margin:0;padding:0;\">\n  <div>\n"
    + "    <svg style=\"margin:0;padding:0;\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"100%\" height=\"100%\" viewBox=\"0 0 1000 1414\">\n"
    + "    </svg>\n  </div>\n</body>\n</html>";
async function SaveEpub() {
    log("Generating EPUB... ")
    let sources = vm.sources;

    const blobWriter = new zip.BlobWriter("application/zip");
    const writer = new zip.ZipWriter(blobWriter);

    await writer.add("mimetype", new zip.TextReader("application/epub+zip"), { level: 0 });
    await writer.add("META-INF/container.xml", new zip.TextReader(container));
    await writer.add("OEBPS/manga.opf", new zip.TextReader(CreatePackage(sources)));
    await writer.add("OEBPS/nav.xhtml", new zip.TextReader(CreateNav(sources)));


    for (const source of sources) {
        await writer.add("OEBPS/Text/" + source.id + ".xhtml", new zip.TextReader(CreateXhtml(source, vm.metadata_title)));
        if (source.from == "placeholder") continue;
        await writer.add("OEBPS/Images/" + source.mappedFilename, new zip.BlobReader(source.blob), { level: 0 });

    }

    await writer.close();
    let epubname = "test.epub";
    const blob = await blobWriter.getData();
    log("Dowmload EPUB:" + epubname)
    const u = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = u;
    a.download = epubname;
    a.click();

}
function MapSourceName() {
    for (const src of vm.sources) {
        src.mappedFilename = MapEpubFilename(src.filename);
        src.id = src.mappedFilename.Path_GetFilenameWithoutExtension();
        console.log(src.id);
    }
}

function CreatePackage(sources) {
    let itemrefs = "";
    let items = "";
    let items2 = "";
    let metadata = GetMetadataXml();
    metadata += "    <dc:identifier id=\"uuid\">" + uuidv4() + "</dc:identifier>\n";
    metadata += "    <meta property=\"dcterms:modified\">" + (new Date().toISOString().substr(0, 19) + 'Z') + "</meta>\n";
    let counter = 0;
    items += "    <item id=\"nav\" href=\"nav.xhtml\" media-type=\"application/xhtml+xml\" properties=\"nav\"/>\n";
    for (const src of sources) {
        let properties = "";
        let id = src.id;
        if (counter == 0) { properties = "properties=\"cover-image\" " }
        items += "    <item id=\"x-" + id + "\" href=\"Text/" + id + ".xhtml\" media-type=\"application/xhtml+xml\" properties=\"svg\" />\n";
        if (src.from != "placeholder") {
            items2 += "    <item id=\"i-" + id + "\" href=\"Images/" + src.mappedFilename + "\" "
                + "media-type=\"" + src.mappedFilename.Path_GetMediaType() + "\" " + properties + "/>\n";
        }
        if (counter == 0) { properties = "properties=\"rendition:page-spread-center\" "; }
        else if (counter % 2 == 0) { properties = "properties=\"page-spread-left\" "; }
        else { properties = "properties=\"page-spread-right\" "; }
        itemrefs += "    <itemref idref=\"x-" + id + "\" " + properties + "/>\n";
        counter++;
    }
    return package_template.replace("{2}", itemrefs).replace("{1}", items + items2).replace("{0}", metadata);
}
function CreateNav(sources) {
    let toc = "";
    let landmark = "";
    for (const src of sources) {
        if (src.landmark) {
            landmark += "        <li><a epub:type=\"" + src.guide + "\" href=\"Text/" + src.id + ".xhtml\">" + MapLandmark(src.landmark, vm.metadata_language) + "</a></li>\n";
        }
        if (src.toc) {
            toc += "        <li><a href=\"Text/" + src.id + ".xhtml\">" + src.toc + "</a></li>\n";
        }
    }
    return nav_template.replace("{1}", landmark).replace("{0}", toc).replace("{title}", vm.metadata_title);

}
function MapLandmark(s, lang) {
    const mapLang = new Map([["ja", 0], ["zh-CN", 1], ["zh-TW", 2]]);
    const mapS = new Map([["cover", 0], ["toc", 1], ["bodymatter", 2], ["colophon", 3]]);
    const str = [
        ["表紙", "目次", "本編", "奥付"],
        ["封面", "目录", "正文", "版权页"]
    ];
    return str[mapLang.get(lang)][mapS.get(s)]

}
function CreateXhtml(source, title) {
    if (source.from == "placeholder") {
        return xhtml_placeholder.replace("{title}", title)
    }
    return xhtml_template
        .replaceAll("{w}", source.image.width)
        .replaceAll("{h}", source.image.height)
        .replace("{href}", "../Images/" + source.mappedFilename)
        .replace("{title}", title);
}

function MapEpubFilename(filename, exist) {
    let r = ""
    let t = filename.Path_GetFilename();
    var reg = /^[0-9a-zA-Z\._]+$/;
    for (const c of t) {
        if (c.match(reg))
            r += c;
    }
    return r;
}