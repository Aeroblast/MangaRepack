const optionalInputTemplates = document.getElementById("metadata_editor_templates");
const optionalInputs = document.getElementById("metadata_editor_optional");
const creatorMetaTemplate = optionalInputTemplates.children[0];
const dateMetaTemplate = optionalInputTemplates.children[1];
const publisherMetaTemplate = optionalInputTemplates.children[2];
const sourceMetaTemplate = optionalInputTemplates.children[3];
const generalMetaTemplate = optionalInputTemplates.children[4];


const creatorInputCompenent = {
    data() {
        return {
            t_value: "",
            t_file_as: "",
        }

    },
    methods: {
        Destory() {
            console.log(this.xml)
            DestoryMetadataInput(this.id)
        },
    },
    computed: {
        xml() {
            let r = "";
            let id = 0;
            for (const item of vm.metadataInputs) {
                if (this.id == item.id) { break; }
                if (item.type == "metadata-input-creator")
                    id++;
            }
            id = "creator" + id;
            if (this.t_value != "") r += "    <dc:creator id=\"" + id + "\">" + this.t_value + "</dc:creator>\n";
            if (this.t_file_as != "") r += "    <meta property=\"file-as\" refines=\"#" + id + "\">" + this.t_file_as + "</meta>\n";
            return r;
        }
    },
    props: ["ui", "id"],
    template: creatorMetaTemplate.outerHTML.replaceAll("data-v", "v").replaceAll("data-ref", "ref")
}

const dateInputCompenent = {
    data() {
        return {
            t_value: new Date().toISOString(),
        }

    },
    methods: {
        Destory() {
            console.log(this.xml)
            DestoryMetadataInput(this.id)
        },
    },
    computed: {
        xml() {
            let r = "";
            if (this.t_value != "") r += "    <dc:date>" + this.t_value + "</dc:date>\n";
            return r;
        }
    },
    props: ["ui", "id"],
    template: dateMetaTemplate.outerHTML.replaceAll("data-v", "v").replaceAll("data-ref", "ref")
}

const publisherInputCompenent = {
    data() {
        return {
            t_value: "",
            t_file_as: "",
        }

    },
    methods: {
        Destory() {
            console.log(this.xml)
            DestoryMetadataInput(this.id)
        },
    },
    computed: {
        xml() {
            let r = "";
            let id = 0;
            for (const item of vm.metadataInputs) {
                if (this.id == item.id) { break; }
                if (item.type == "metadata-input-publisher")
                    id++;
            }
            id = "publisher" + id;
            if (this.t_value != "") r += "    <dc:publisher id=\"" + id + "\">" + this.t_value + "</dc:publisher>\n";
            if (this.t_file_as != "") r += "    <meta property=\"file-as\" refines=\"#" + id + "\">" + this.t_file_as + "</meta>\n";
            return r;
        }
    },
    props: ["ui", "id"],
    template: publisherMetaTemplate.outerHTML.replaceAll("data-v", "v").replaceAll("data-ref", "ref")
}
const sourceInputCompenent = {
    data() {
        return {
            t_value: "",
        }

    },
    methods: {
        Destory() {
            console.log(this.xml)
            DestoryMetadataInput(this.id)
        },
    },
    computed: {
        xml() {
            let r = "";
            if (this.t_value != "") r += "    <dc:source>" + this.t_value + "</dc:source>\n";
            return r;
        }
    },
    props: ["ui", "id"],
    template: sourceMetaTemplate.outerHTML.replaceAll("data-v", "v").replaceAll("data-ref", "ref")
}
const generalInputCompenent = {
    data() {
        return {
            t_value: "",
            t_property: "",
        }

    },
    methods: {
        Destory() {
            console.log(this.xml)
            DestoryMetadataInput(this.id)
        },
    },
    computed: {
        xml() {
            if (this.t_property != "" && this.t_value != "") { return "    <meta property=\"" + this.t_property + "\">" + this.t_value + "</meta>\n"; }

        }
    },
    props: ["ui", "id"],
    template: generalMetaTemplate.outerHTML.replaceAll("data-v", "v").replaceAll("data-ref", "ref")
}
const inputCompenents = [
    { name: 'metadata-input-creator', settings: creatorInputCompenent },
    { name: 'metadata-input-date', settings: dateInputCompenent },
    { name: 'metadata-input-publisher', settings: publisherInputCompenent },
    { name: 'metadata-input-source', settings: sourceInputCompenent },
    { name: 'metadata-input-general', settings: generalInputCompenent }
];

function DestoryMetadataInput(id) {
    let i = 0;
    for (const item of vm.metadataInputs) {
        if (id == item.id) { break; }
        i++;
    }
    if (i < vm.metadataInputs.length) {
        vm.metadataInputs.splice(i, 1);
    }
}

function CheckInputValid() {
    if (vm.metadata_title == "") return false;
    return true;
}

function GetMetadataXml() {
    let optional = document.getElementById('metadata_editor_optional');
    let r = "    <dc:title id=\"title\">" + vm.metadata_title + "</dc:title>\n";
    if (vm.metadata_title_file_as != "")
        r += "    <meta property=\"file-as\" refines=\"#title\">" + vm.metadata_title_file_as + "</meta>\n";
    r += "    <dc:language>" + vm.metadata_language + "</dc:language>\n";
    for (const output of optional.getElementsByClassName("metadata-output")) {
        r += output.getAttribute("data-xml");
    }
    return r;
}