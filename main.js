
const fileInput = document.getElementById("file-input");
const ratio = 1.414;//h/w
var globleCounter = 0;
function GenarateId() { globleCounter++; return globleCounter; }
const vueSettings = {
    data() {
        return {
            ui: GetUserLocale(),
            log: [],
            log_var: "",
            sources: [],
            source_commonPath: "",
            selected: -1,
            pageEditorSp: "",
            settings_sort: "SortByFullPath",
            settings_zip_encoding: "shift-jis",
            metadata_title: "",
            metadata_title_file_as: "",
            metadata_language: "ja",
            metadataInputs: [],
        }
    },
    mounted() {
        Split(['#pageListWarpper', '#editorZone'], {
            sizes: [30, 70],
        })
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
        let pv = this.$refs.pageViewer;
        pv.width = window.innerWidth;
        pv.height = pv.width / 2 * ratio;
    },

    methods: {
        ImportZip(event) {
            fileInput.click();
            document.querySelector("#nav_content").click();
        },
        Save() {
            if (this.sources.length == 0) {
                log("No content!", "danger")
                return;
            }
            if (!CheckInputValid()) {
                document.querySelector("#nav_metadata_editor");
                log("metadata not complete!", "danger");
                return;
            }
            document.querySelector("#nav_preview").click();
            SaveEpub();

        },
        ClickItem(e) {
            let index = this.sources.indexOf(e);
            this.ActivePage(index)
        },
        ActivePage(index) {
            if (index == 0) {
                this.selected = 0; this.pageEditorSp = "cover";
            }
            else {
                let r, l;//direction: right to left
                if (index % 2 == 0) { l = index; r = l - 1; } else { r = index; l = r + 1; }
                this.selected = r; this.pageEditorSp = "";
                if (r + 1 == this.sources.length) {
                    this.pageEditorSp = "single";
                }
            }
            //draw in pageViewer 
            let canvas = vm.$refs.pageViewer;
            let ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (this.selected == 0) {
                //center
                let img = this.sources[0].image;
                let fit = FitImage(img, canvas.width, canvas.height);
                ctx.drawImage(img, fit[0], fit[1], fit[2], fit[3])
            } else {
                {
                    //right
                    let img = this.sources[this.selected].image;
                    let fit = FitImage(img, canvas.width / 2, canvas.height);
                    ctx.drawImage(img, canvas.width / 2, fit[1], fit[2], fit[3])
                }
                if (this.selected + 1 < this.sources.length) {
                    //left
                    let img = this.sources[this.selected + 1].image;
                    let fit = FitImage(img, canvas.width / 2, canvas.height);
                    if (fit[0] > 0) fit[0] = canvas.width / 2 - fit[2];
                    ctx.drawImage(img, fit[0], fit[1], fit[2], fit[3])
                }

            }
            //active page editor
            if (index == 0) { document.querySelector("#nav_tocEntryRight").click(); }
            else if (index % 2 == 0) {
                document.querySelector("#nav_tocEntryLeft").click();
            } else {
                document.querySelector("#nav_tocEntryRight").click();
            }
        },
        AddPlaceholder(offset) {
            if (this.selected < 0) return;
            if (this.selected + offset >= this.sources.length) return;
            let ph = CreateSourcePlaceholder(this.sources[this.selected + offset - 1])
            this.sources.splice(this.selected + offset, 0, ph);
            this.ActivePage(this.selected + offset)
            log("Placeholder inserted.")
        },
        AddMetadataInput(type) {
            if (type == "metadata-input-date") {
                if (this.metadataContainsDate) { return; }
            }
            this.metadataInputs.push({ id: GenarateId(), type: type })
        },
        DeletePage(offset) {
            if (this.selected < 0) return;
            if (this.selected + offset >= this.sources.length) return;
            let p = this.sources[this.selected + offset];
            this.sources.splice(this.selected + offset, 1);
            this.ActivePage(this.selected + offset)
            if (p.from == "placeholder") {
                log("Delete placeholder: " + p.filename)
            } else {
                log("Delete page: " + p.filename)
            }

        }
    },
    computed: {
        settings_lang: {
            get() {
                if (this.ui.nav_settings == locale_zhCN.nav_settings) return "zh-CN";
                if (this.ui.nav_settings == locale_en.nav_settings) return "en";
            },
            set(newValue) {
                switch (newValue) {
                    case "zh-CN": this.ui = locale_zhCN; break;
                    case "en": this.ui = locale_en; break;
                }
            }
        },
        metadataContainsDate() {
            for (const item of this.metadataInputs) {
                if (item.type == "metadata-input-date")
                    return true;
            }
            return false;
        },
        navEditorR_filename() {
            if (this.selected < 0) return undefined;
            return this.sources[this.selected].filename;
        },
        navEditorR_landmark: {//first
            get() {
                if (this.selected < 0) return undefined;
                let r = this.sources[this.selected].landmark;
                if (r)
                    return r;
                else
                    return "none";
            },
            set(newValue) {
                if (this.selected < 0) return;
                let src = this.sources[this.selected];
                logValueChange("landmark of ", src, src.landmark, newValue)
                if (newValue == "none") newValue = "";
                src.landmark = newValue;
            }
        },
        navEditorR_toc: {
            get() {
                if (this.selected < 0) return undefined;
                let r = this.sources[this.selected].toc;
                if (r)
                    return r;
                else
                    return "";
            },
            set(newValue) {
                if (this.selected < 0) return;
                let src = this.sources[this.selected];
                logValueChange("toc of ", src, src.toc, newValue)
                src.toc = newValue;
            }
        },
        navEditorL_filename() {
            if (this.selected + 1 >= this.sources.length) return undefined;
            return this.sources[this.selected + 1].filename;
        },
        navEditorL_landmark: {
            get() {
                if (this.selected + 1 >= this.sources.length) return undefined;
                let r = this.sources[this.selected + 1].landmark;
                if (r)
                    return r;
                else
                    return "none";
            },
            set(newValue) {
                if (this.selected + 1 >= this.sources.length) return;
                let src = this.sources[this.selected + 1];
                logValueChange("landmark of ", src, src.landmark, newValue)
                if (newValue == "none") newValue = "";
                src.landmark = newValue;
            }
        },
        navEditorL_toc: {//first
            get() {
                if (this.selected + 1 >= this.sources.length) return undefined;
                let r = this.sources[this.selected + 1].toc;
                if (r)
                    return r;
                else
                    return "";
            },
            set(newValue) {
                if (this.selected + 1 >= this.sources.length) return;
                let src = this.sources[this.selected + 1];
                logValueChange("toc of ", src, src.toc, newValue)
                src.toc = newValue;
            }
        }
    }
}
const app = Vue.createApp(vueSettings);

for (const com of inputCompenents) {
    app.component(com.name, com.settings);
}
const vm = app.mount('#main');
fileInput.onchange = function () {
    document.body.setAttribute("data-state", "loading");
    log(vm.ui.msg_importing, "info", "msg-source-count");
    ProcInputFiles(fileInput.files).then(() => {
        document.body.setAttribute("data-state", "");
        log(vm.ui.msg_imported, "success");
    });
}
async function ProcInputFiles(files) {
    for (const f of fileInput.files) {
        console.log('Opening ' + f.name);
        if (f.name.endsWith(".zip")) {
            const reader = new zip.ZipReader(new zip.BlobReader(f), { filenameEncoding: vm.settings_zip_encoding });
            const entries = await reader.getEntries();
            for (const entry of entries) {
                if (entry.filename.endsWith(".jpg")) {
                    console.log(entry.filename);
                    const blob = await entry.getData(new zip.BlobWriter('image/jpeg'));
                    vm.sources.push(await CreateSource(blob, f.name + "/" + entry.filename, "archive"));
                }
                if (entry.filename.endsWith(".png")) {
                    console.log(entry.filename);
                    const blob = await entry.getData(new zip.BlobWriter('image/png'));
                    vm.sources.push(await CreateSource(blob, f.name + "/" + entry.filename, "archive"));
                }
            }
            await reader.close();
        }
        if (f.name.endsWith(".jpg") || f.name.endsWith(".png")) {
            vm.sources.push(await CreateSource(f, f.name, "file"));
        }
    }
    if (vm.sources.length == 0) return;
    let common = vm.sources[0].filename;
    for (const src of vm.sources) {
        common = StringCommonStart(common, src.filename)
    }
    vm.sources[0].toc = "Cover";
    vm.sources[0].landmark = "cover";
    vm.source_commonPath = common;
    vm.metadata_title = common.replaceAll('/', ' ')
}
vm.sources.sort(sortSourceByFullPath);


async function CreateSource(blob, name, from) {
    let obj = new Object();
    obj.image = await createImageBitmap(blob);
    obj.filename = name;
    obj.blob = blob;
    obj.thumbURL = await CreateThumbURL(obj.image);
    obj.from = from;//archive file placeholder
    return obj;
}
var placeholderImage, placeholderThumbURL
(async () => {
    let s = new OffscreenCanvas(80, 80 * ratio);
    let c = s.getContext('2d');
    c.font = "10px Arial";
    c.fillText("Placeholder", 3, 40);
    let b = await s.convertToBlob();
    placeholderThumbURL = URL.createObjectURL(b);
    placeholderImage = s;
})();


function CreateSourcePlaceholder(after_source) {
    let obj = new Object();
    obj.image = placeholderImage;
    obj.filename = after_source.filename.Path_GetDirectory() + "" + after_source.filename.Path_GetFilenameWithoutExtension() + "_blank";
    obj.blob = null;
    obj.thumbURL = placeholderThumbURL;
    obj.from = "placeholder"
    return obj;
}
function sortSourceByFullPath(s1, s2) {
    let name1 = s1.filename, name2 = s2.filename;
    if (name1 < name2) {
        return -1;
    }
    if (name1 > name2) {
        return 1;
    }
    return 0;
}
function sortSourceByFilename(s1, s2) {
    let name1 = s1.filename, name2 = s2.filename;
    if (name1 < name2) {
        return -1;
    }
    if (name1 > name2) {
        return 1;
    }
    return 0;
}
async function CreateThumbURL(image) {
    const ow = 140, oh = ow * ratio;
    let s = new OffscreenCanvas(ow, oh);
    let fit = FitImage(image, ow, oh);
    let c = s.getContext('2d');
    c.drawImage(image, fit[0], fit[1], fit[2], fit[3]);
    let b = await s.convertToBlob();
    return URL.createObjectURL(b);
}

function FitImage(image, w, h) {
    let fw = w, fh = h;
    let x = 0, y = 0;
    if (image.width / image.height > w / h) {
        fh = w * image.height / image.width;
        y = (h - fh) / 2;
    }
    else {
        fw = h * image.width / image.height;
        x = (w - fw) / 2;
    }
    return [x, y, fw, fh];
}
/**
 * 
 * @param {*} message 
 * @param {*} type
 * @param {String} bsClass  value: primary secondary success danger warning info 
 */
function log(content, bsClass = "info", type = "msg-normal") {
    logValueChangeEnd();
    let id = GenarateId();
    vm.log.push({ content: content, type: type, bsClass: bsClass, time: new Date().toLocaleTimeString(), id: id });
    console.log(content)
    let e = document.querySelector("#log");
    setTimeout(() => { e.scrollTo(0, e.scrollHeight); }, 100);
    return id;
}
var editingSource = null;
var editingLogId = null;
var editingMsg = null;
function logValueChange(msg, src, field, newValue) {
    if (!field) field = "(empty)";
    if (editingSource == null || editingMsg != msg || src.filename != editingSource.filename) {
        editingLogId = log(
            msg + shortenStringFromEnd(src.filename) + ": "
            + field + "=>"
            , "primary", "msg-editing");
        editingSource = src;
        editingMsg = msg;
    }
    vm.log_var = newValue;
}
function logValueChangeEnd() {
    if (!editingLogId) return;
    let i = 0;
    for (const msg of vm.log) {
        if (msg.id == editingLogId) {
            vm.log[i] = { content: msg.content + vm.log_var, type: "msg-normal", bsClass: msg.bsClass, time: msg.time, id: msg.id };
            break;
        }
        i++;
    }
    editingSource = null;
    editingLogId = null;
}
function ToggleLog() {
    let e = document.querySelector("#log");
    if (e.getAttribute("data-enlarge")) {
        e.removeAttribute("data-enlarge")
    } else {
        e.setAttribute("data-enlarge", "true")
    }
    setTimeout(() => { e.scrollTo(0, e.scrollHeight); }, 100);
}
app.component("msg-source-count", {
    props: ["source_count", "id", "time"],
    template: "<p>{{time}}: <slot></slot>{{source_count}}</p>"
});
app.component("msg-normal", {
    props: ["id", "time"],
    template: "<p>{{time}}: <slot></slot></p>"
});
app.component("msg-editing", {
    props: ["id", "time", "log_var"],
    template: "<p>{{time}}: <slot></slot>{{log_var}}</p>"
});