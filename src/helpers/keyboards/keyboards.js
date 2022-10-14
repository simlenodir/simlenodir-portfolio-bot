import { read } from "../../utils/FS.js";
import keyboardInfo from "./keyboard.info.js";


const allprojects = read('projects.json')
let projects = []
for (let i = 0; i < allprojects.length; i += 2) {
    let arr = []
    
    if (allprojects[i]) {
        arr.push(allprojects[i].name, allprojects[i + 1]?.name)
    }
    projects.push(arr.filter(e => e))
}
projects.push([keyboardInfo.main_menu])

export default {
    menu: [
        [keyboardInfo.my_projects],
        [keyboardInfo.info, keyboardInfo.elements]
    ],
    projects
}