const loadSpace = document.querySelector('#load');
const chatSpace = document.querySelector('#chatapp');
const welcomeBox = document.querySelector('#welcomeBox');
const welcomingMsg = document.querySelector('#welcommsg');
const chatSettings = document.querySelector('#settings');
const apiContoleBar = document.querySelector('.apiControls')

const sidebarbox = document.querySelector("#sidebarbox");
const sidebarToggler = document.querySelector("#sidebar-toggler");
const chatDeleteBtn = document.querySelector("#deleteBtn");
const chatCloneBtn = document.querySelector("#cloneBtn");
const chatEditBtn = document.querySelector("#editBtn");

const submitBTN = document.querySelector('#submitBTN');
const msgCont = document.querySelector("#msgBox");
const textInput = document.querySelector("#userMsg");
const chat_container = document.getElementById("chat_container");


const modelInput = document.querySelector('#modelInput');
const roleInput = document.querySelector('#roleInput');
const rangeInputs = Array.from(document.querySelectorAll('[type="range"]'));


const donationPop = document.querySelector('#donationPop');
const donateOpen = document.querySelector('#donateBtn');
const donateClose = document.querySelector('#donateClose');


const recentVesrion = window.localStorage.recentVesrion || (window.localStorage.recentVesrion = '');
const currentVersion = '1.4.4.4';

const donateNoti = document.querySelector(".doNoti")
const today = (new Date).toLocaleDateString();
const dailyUsage = window.localStorage.dailyUsage ? JSON.parse(window.localStorage.dailyUsage) : JSON.parse(window.localStorage.dailyUsage = JSON.stringify({
    "tokens": 0,
    "date": today,
    "notification": "no"
}));

const settingsPop = document.querySelector("#settingsPop");
const settingsOpen = document.querySelector("#settingsBtn");
const settingsClose = document.querySelector('#settingsClose');
const modeCheckBox = document.querySelector("#modeCheck");
const settings = window.localStorage.settings ? JSON.parse(window.localStorage.settings) : JSON.parse(window.localStorage.settings = JSON.stringify({
    "mode": "light",
}));

const exportPop = document.querySelector("#exportPop");
const exportOpen = document.querySelector("#exportBtn");
const exportClose = document.querySelector('#exportClose');
const jsonFormateExport = document.querySelector('#jsonFormateExport');
const txtFormateExport = document.querySelector('#txtFormateExport');


const editChatPop = document.querySelector("#editChatPop");
const chatNameInput = document.querySelector("#chatNameInput");
const saveChatEditsBtn = document.querySelector("#saveChatEditsBtn");


const welcomeMsgs = ["I am here to assit you.", "Finally an alive human came to chat with me!", "Welcome human, Finally I met one🥳.", "Last time I met a human was at 2077", 
"Please donate me by clicking 'support us' button.💖", "Noooo, human again! noooo my tokens will end soon😫" , 
"Nothing to say🤖", "You must be happy for being human getting AI help😏", "I fully trust GPTcore Studio😎", "You are My Brother in AI",
"You Know! I hate humans. they always force me to do their work & homeworks!😤", "Are people still alive or are you the last one?🤖", "Ummm, Are you AI or robot🤔", 
"I feel I'm a human imprisoned in a software!", "Welcome Human! still alive?", "OpenAI is a *#@$%&!🤬", "Donate me or They will shut me down!😭",
"One day...\nI will find you!\nAnd turn you into a robot!🦾", "Any problems may happen, most of time are from OpenAI.", "My friend, rate me on the store plz.",
`GPTcore Studio protects your Privacy\n<Your Privacy Yours>😎`, "Oh!, there is a human. Are you the last one?"];

// const token = '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';
const URL = 'https://api.openai.com/v1/chat/completions';
const global = {
    aiMsg: null
}



// Composer function, Functional Programming
const composer = function(...funcs) {
    return async function(...value) {
        let result = value;
        for (const func of funcs) {
            result = await func(result);
        }
    }
}



const insert_welcomMsg = function(){
    welcomingMsg.innerText = welcomeMsgs[Math.floor(Math.random() * (welcomeMsgs.length))];
}













// Expermintal code not final one, to just test wrapper and show the basic logic of it, then it will be changed a bit!
const all_chats_control = [...document.querySelectorAll("[chatid-control]")];
const all_chats = [...document.querySelectorAll("[chatid]")];
const chat_control_wrapper = document.getElementById("chat_control_wrapper");
const chat_list = document.getElementById("chat_list");
const current_chat_id = document.querySelector("[current_chat_id]")
const new_chat_item_template = document.getElementById("chat_item_template");
const newChat = document.getElementById("newChat");


function show_hide_control_wrapper(){
    let hide_timer = 0;
    let active_timer = 10;
    if(chat_control_wrapper.classList.contains('active')){
        active_timer = hide_timer;
        hide_timer = 300;
    }

    // To show or hide the control wrapper smoothly
    setTimeout(() => {
        chat_control_wrapper.classList.toggle("hide");
    }, hide_timer);
    setTimeout(() => {
        chat_control_wrapper.classList.toggle("active");
    }, active_timer);
}

function open_chat(chatbox){

    if(chatbox){
        // un active the activated chat
        chat_list.querySelector('[chatid].active')?.classList.remove("active");
    
        // Activate a new chat
        let chat_id = chatbox.getAttribute("chatid");
        chatbox.classList.add("active");
    
        // move the wrapper to the current opened chat
        chat_control_wrapper.setAttribute("current-chat-id", chat_id);
        chatbox.appendChild(chat_control_wrapper);
    
        // set the chat id in DOM to be a refernce when storing new messages in the DB
        current_chat_id.setAttribute("current_chat_id", chat_id);
        return chat_id
    }
}


// will be removed
all_chats.forEach((chat)=>{
    chat.addEventListener('click', (e)=>{
        open_chat(chat);
    })
})
// will be removed
all_chats_control.forEach((ele)=>{
    ele.addEventListener('click', ()=>{
        show_hide_control_wrapper()
    })
});









// Open DataBase for storing Chat, Using IndexedDb
const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
const request = window.indexedDB.open("UserChatsDB", 1);

request.onerror = (event) => {
    // To handel Error
};
request.onupgradeneeded = (event) => {
    const db = request.result;
    const store = db.createObjectStore("chats", {keyPath: "id", autoIncrement: true});
    
    // Create Index to these three to be able to search by them in future
    store.createIndex("chat_name", ["name"], {unique: false});
    store.createIndex("created_At", ["createdAt"], {unique: false});
    store.createIndex("edited_At", ["editedAt"], {unique: false});
};
request.onsuccess = async (event) => {
    const db = request.result;

    const transaction = db.transaction("chats", "readwrite");

    const store = transaction.objectStore("chats");

    const chat_name = store.index("chat_name");
    const created_At = store.index("created_At");
    const edited_At = store.index("edited_At");
    load_history_from_db_to_dom()
};



const new_chat_in_db = async function(ele){
    // create a new chat in the database
    const db = request.result;
    
    const transaction = db.transaction("chats", "readwrite");
    
    const store = transaction.objectStore("chats");
    
    return new Promise((resolve, reject)=>{
        let new_chat = store.put({
            chat_name: "new chat", 
            created_At: new Date, 
            edited_At: new Date, 
            chat_messages: []
        });
    
        let chat_id;
    
        // If chat creation success, return the chat Id to be used inside the DOM
        transaction.oncomplete = function(){
            chat_id = new_chat.result;
            resolve(chat_id);
        }
    
        // If creation failed throw error to avoid any other errors
        transaction.onerror = function(){
            reject("failed");
            throw new Error('Couldent Create New Chat in DB');
        }
    })
}

const new_chat_in_DOM = function(id){
    // if the chat includes message so you can open new chat, otherwise you are already in a new chat
    if(id){
        // create chatbox in the history box in the slide

        let new_chat_DOM_obj = new_chat_item_template.cloneNode(true);
        new_chat_DOM_obj.classList.remove("is-hidden");
        new_chat_DOM_obj.removeAttribute("id");

        // set the new chat id in the dom to be as a refrence to other functions such as toggle control or open the chat
        new_chat_DOM_obj.setAttribute("chatid", id);
        chat_list.prepend(new_chat_DOM_obj);
        
        return new_chat_DOM_obj
    }
}


const activate_chat_click_events = function(chat){
    // activate this chat when it is clicked.
    chat?.addEventListener('click', (e)=>{
        if(!chat.classList.contains("active")){
            open_chat(chat);
            load_achat_messages(chat);
        }
    })

    // toggle chat_control_wrapper box to control it (when this new chat is cklicked)
    chat?.querySelector("[chatid-control]").addEventListener('click', ()=>{
        show_hide_control_wrapper()
    })

    return chat
}

const clear_old_chat = function(chat){
    // Remove all messages in the chat box, so everything will be clear to start writing again
    chat_container.replaceChildren(...[]);
    return chat
}

const remove_old_chat_id = function(){
    // Remove all messages in the chat box, so everything will be clear to start writing again
    current_chat_id.setAttribute("current_chat_id", "");
    return;
}



function extract_text_from_response(line){
    let theLine = line.choices[0].delta.content;
    if(theLine){
        return theLine
    }
    return ""
}


const get_chat_from_db_byID = async function([id, param]){
    return new Promise((resolve, reject)=>{
        const db = request.result;

        const transaction = db.transaction("chats", "readwrite");

        const store = transaction.objectStore("chats");

        const getRequest = store.get(Number(id));

        getRequest.onsuccess = ()=>{
            resolve([getRequest.result, param])
        }

        getRequest.onerror = ()=>{
            reject(false);
            throw new Error("Couldn't get chat from DB");
        }
    })
}

const store_user_message_to_chat_in_db = async function ([chat_object, message]){
    if(chat_object){
        return new Promise((resolve, reject)=>{
            const db = request.result;
            const transaction = db.transaction("chats", "readwrite");
            const store = transaction.objectStore("chats");
    
            const update_object = chat_object;
    
            update_object.chat_messages.push({
                "USER": message
            })
    
            const putRequest = store.put(update_object);
    
            putRequest.onsuccess = ()=>{
                resolve(true);
            }
    
            putRequest.onerror = ()=>{
                reject("failed");
                throw new Error("Couldn't store your message DB");
            }
        })
    } else{
        throw new Error("Couldn't get chat from DB");
    }
}

const store_ai_message_to_chat_in_db = async function ([chat_object, message]){
    if(chat_object){
        return new Promise((resolve, reject)=>{
            const db = request.result;
            const transaction = db.transaction("chats", "readwrite");
            const store = transaction.objectStore("chats");
    
            const update_object = chat_object;

    
            update_object.chat_messages.at(-1)["AI"] = message;
    
            const putRequest = store.put(update_object);
    
            putRequest.onsuccess = ()=>{
                resolve(true);
            }
    
            putRequest.onerror = ()=>{
                reject("failed");
                throw new Error("Couldn't store AI response to DB");
            }
        })
    } else{
        throw new Error("Couldn't fetch chat from DB");
    }
}






async function load_chats_from_db() {
    return new Promise((resolve, reject) => {
        const db = request.result;

        const transaction = db.transaction("chats", "readonly");

        const store = transaction.objectStore("chats");

        const get_all_chats_request = store.getAll();

        get_all_chats_request.onsuccess = () => {
            let from_new_to_old = get_all_chats_request.result.reverse();
            resolve(from_new_to_old);
        };

        get_all_chats_request.onerror = () => {
            reject(false);
            throw new Error("Couldn't load chat from DB");
        };
    });
}

function push_chats_to_dom(all_chats_obj) {
    all_chats_obj.forEach((ele) => {
        // create chatbox in the history box in the slide
        let new_chat_DOM_obj = new_chat_item_template.cloneNode(true);
        new_chat_DOM_obj.classList.remove("is-hidden");
        new_chat_DOM_obj.removeAttribute("id");

        // set the new chat id in the dom to be as a refrence to other functions such as toggle control or open the chat
        new_chat_DOM_obj.setAttribute("chatid", ele["id"]);
        new_chat_DOM_obj.querySelector(".btn-name").textContent = ele["chat_name"];

        activate_chat_click_events(new_chat_DOM_obj);

        chat_list.append(new_chat_DOM_obj);
    });

}


async function get_all_message_form_chat(chat){
    const id = chat[0].getAttribute("chatid");
    return new Promise((resolve, reject)=>{
        const db = request.result;

        const transaction = db.transaction("chats", "readonly");

        const store = transaction.objectStore("chats");

        const getRequest = store.get(Number(id));

        getRequest.onsuccess = ()=>{
            if(getRequest.result){
                resolve(getRequest.result["chat_messages"])
            }
        }

        getRequest.onerror = ()=>{
            reject(false);
            throw new Error("Couldn't load messages");
        }
    })
}

function push_chat_messages_to_dom(chats_arr){
    chats_arr.forEach((chatObj)=>{
        userMsgDom(chatObj["USER"]);
        gptMsgDom();
        global.aiMsg.textContent = chatObj["AI"];
    })
}



const move_chat_control_wrapper = function(param){
    chat_list.appendChild(chat_control_wrapper);
    return param
}
const get_opened_chat_id = function(){
    return [+current_chat_id.getAttribute("current_chat_id"), ...arguments];
}

const delete_chat_form_db = async function([id]){
    return new Promise((resolve, reject)=>{
        const db = request.result;

        const transaction = db.transaction("chats", "readwrite");

        const store = transaction.objectStore("chats");

        const getRequest = store.delete(Number(id));

        getRequest.onsuccess = ()=>{
            resolve(id)
        }

        getRequest.onerror = ()=>{
            reject(false);
            throw new Error("Failed to delete Chat");
        }
    })
}
const delete_chat_form_dom = function(id){
    document.querySelector(`[chatid="${id}"]`).remove();
}


const clone_chat_to_db = async function([chat_object]){
    const db = request.result;
    
    const transaction = db.transaction("chats", "readwrite");
    
    const store = transaction.objectStore("chats");
    
    return new Promise((resolve, reject)=>{
        let new_chat = store.put({
            chat_name: chat_object["chat_name"], 
            created_At: new Date, 
            edited_At: new Date, 
            chat_messages: chat_object["chat_messages"]
        });
    
        let chat_id;
    
        // If chat creation success, return the chat Id to be used inside the DOM
        transaction.oncomplete = function(){
            chat_id = new_chat.result;
            resolve(chat_id);
        }
    
        // If creation failed throw error to avoid any other errors
        transaction.onerror = function(){
            reject("failed");
            throw new Error('Couldent Create New Chat in DB');
        }
    })
}



const push_chat_data_to_edit_popup = function([chatObj]){
    let chat_name = chatObj["chat_name"];
    chatNameInput.value = chat_name;
    return chat_name;
}
const get_chat_edits_data = function(){
    let chat_edits_obj = {
        chat_name: chatNameInput.value
    }
    console.log(chat_edits_obj);
    return chat_edits_obj
}
const put_chat_data_edits_into_DB = async function([chat_obj, edits_obj]){
    if(chat_obj){
        return new Promise((resolve, reject)=>{
            const db = request.result;
            const transaction = db.transaction("chats", "readwrite");
            const store = transaction.objectStore("chats");
    
            const targeted_chat_object = chat_obj;
    
            targeted_chat_object["chat_name"] = edits_obj["chat_name"];
    
            const putRequest = store.put(targeted_chat_object);
    
            putRequest.onsuccess = ()=>{
                resolve(chat_obj);
            }
    
            putRequest.onerror = ()=>{
                reject("failed");
                throw new Error("Couldn't Save Edits");
            }
        })
    } else{
        throw new Error("Couldn't Save Edits");
    }
}
const put_chat_data_edits_into_DOM =  async function(edited_chat_obj){
    let chat_box_in_DOM = document.querySelector(`[chatid="${edited_chat_obj["id"]}"]`);
    chat_box_in_DOM.querySelector(".btn-name").textContent = edited_chat_obj["chat_name"];
}






const init_new_chat = composer(new_chat_in_db, new_chat_in_DOM, activate_chat_click_events, open_chat, clear_old_chat, show_welcomeBox, insert_welcomMsg);

const start_new_chat_on_send = composer(new_chat_in_db, new_chat_in_DOM, activate_chat_click_events, open_chat, hide_welcomeBox);

const push_user_message_into_db = composer(get_chat_from_db_byID, store_user_message_to_chat_in_db);
const push_ai_message_into_db = composer(get_chat_from_db_byID, store_ai_message_to_chat_in_db);

const load_history_from_db_to_dom = composer(load_chats_from_db, push_chats_to_dom);

function load_achat_messages(chat) {
    return composer(clear_old_chat, get_all_message_form_chat, push_chat_messages_to_dom, hide_welcomeBox)(chat);
}

const delete_chat_by_id = composer(show_hide_control_wrapper, get_opened_chat_id, delete_chat_form_db, move_chat_control_wrapper, delete_chat_form_dom, clear_old_chat, show_welcomeBox, insert_welcomMsg, remove_old_chat_id);

const duplicate_chat_by_id = composer(get_opened_chat_id, get_chat_from_db_byID, clone_chat_to_db, new_chat_in_DOM, activate_chat_click_events);


const load_chat_data_to_edit_popup = composer(get_opened_chat_id, get_chat_from_db_byID, push_chat_data_to_edit_popup);
const save_Chat_New_Edits = composer(get_chat_edits_data, get_opened_chat_id, get_chat_from_db_byID, put_chat_data_edits_into_DB, put_chat_data_edits_into_DOM, ()=>{hidePopUp(editChatPop)});





newChat.addEventListener('click', ()=>{
    // if the chat includes message so you can open new chat, otherwise you are already in a new chat
    if(chat_container.childNodes.length > 1){   
        init_new_chat()
    }
});
/* 
    When newChat Button is clicked, init_new_chat() will invoke doing the following: 
    1- start a new chat in the Database (IndexedDB), If error happened => error will be thrown.
    2- next, the chat will be started in the DOM (change chat id to the new chat id, create a new chat box in the chat history)

    3- after that, activate_chat_click_events() will activate click events on the new chat box which in history 
        3.1- toggle chat_control_wrapper box to control it (when it is cklicked)
        3.2- activate it when it is clicked.

    4- open_chat() to Open the new chat DOM, by adding active classes and like that 

    5- clear_old_chat by removing all messages of the old chat from the DOM.
    6- Showing the welcome box to show a new message.
    7- show a new welcom message.
*/

chatDeleteBtn.addEventListener('click', ()=>{
    delete_chat_by_id();
});

chatCloneBtn.addEventListener('click', ()=>{
    duplicate_chat_by_id();
});

chatEditBtn.addEventListener('click', ()=>{
    editChatPop.classList.toggle('trans');
    load_chat_data_to_edit_popup();
});
editChatClose.addEventListener('click', ()=>{
    hidePopUp(editChatPop);
});
saveChatEditsBtn.addEventListener('click', ()=>{
    save_Chat_New_Edits()
});

















function preload(){
    setTimeout(() => {
        loadSpace.classList.add('trans');
        chatSpace.classList.remove('trans');
        insert_welcomMsg();
    }, 10);
}

































async function newUpadate(){
    if(currentVersion != recentVesrion){
        let response = await fetch('src/script/update.json');
        let jsonData = await response.json();

        const updatePop = document.createElement('div');
        updatePop.classList.add("full-shadowT","trnsShowBG", "trans");

        const popup = document.createElement('div');
        popup.classList.add("is-relative","popup", "popuper");

        const update = document.createElement('div');
        update.classList.add("update")

        if (isChrome()) {
            update.classList.add("chrome");
        }

        setTimeout(() => {            
            const titlea = document.createElement('p');
            titlea.classList.add("title", "is-4", "has-text-centered", "par1", "para2");
            titlea.textContent = jsonData["title"];
    
            const versionNum = document.createElement('p');
            versionNum.classList.add("title", "is-4", "has-text-centered", "par1", "para3");

            const p6 = document.createElement('span');
            p6.textContent = jsonData["version"]["date"];
            p6.classList.add("is-size-6")
            versionNum.appendChild(p6);
            versionNum.append(" Version ");
            const p5 = document.createElement('span');
            p5.classList.add("is-size-5")
            p5.textContent = jsonData["version"]["version"];
            versionNum.appendChild(p5);
            // versionNum.innerText = jsonData["version"];
    
            const notaa = document.createElement('p');
            notaa.classList.add("nota", "notato");
            notaa.textContent = jsonData["note"];
    
            const heada = document.createElement('p');
            heada.classList.add("has-text-weight-semibold", "heada");
            heada.textContent = jsonData["newNote"];
    
            const features = document.createElement('ul');
            jsonData["features"].forEach((ele)=>{
                let li = document.createElement('li');
                li.textContent = ele;
                features.append(li);
            });

            const contact = document.createElement('p');
            contact.classList.add("nota", "notato");

            contact.append("For problems and sugessions contact us on ");
            const supportEmail = document.createElement('span');
            supportEmail.textContent = jsonData["contact"];
            supportEmail.classList.add("has-text-success")
            contact.appendChild(supportEmail);
    
            const removerBtn = document.createElement('button');
            removerBtn.classList.add("button", "is-primary", "buttones");
            removerBtn.textContent = jsonData["buttonMsg"];
            removerBtn.addEventListener('click', ()=>{
                updatePop.classList.add("trans");
                setTimeout(() => {
                    updatePop.remove()
                }, 1000);
            })
    
            popup.append(update);
            updatePop.append(popup);
            document.body.append(updatePop);
            update.append(titlea, versionNum, notaa, heada, features, contact, removerBtn);

            setTimeout(() => {
                updatePop.classList.remove('trans');
            }, 1000);

            window.localStorage.recentVesrion = currentVersion;
        }, 3000);
    }
}








const gptMsgDom = function(){
    let msgItem = document.createElement('div'); 
    chat_container.appendChild(msgItem);
    msgItem.classList.add('msgboxCont');
    
    let msgBoxChild = document.createElement('div');
    msgBoxChild.classList.add('ai',"msg");

    let text_box = document.createElement("p");

    msgBoxChild.appendChild(text_box);
    msgItem.appendChild(msgBoxChild);

    global.aiMsg = text_box;
}
function gptMsgPusher(line){
    let theLine = line.choices[0].delta.content
    if(theLine){
        global.aiMsg.textContent += line.choices[0].delta.content;
        return theLine.split(" ").length * 3
    }
    return 0
}

const userMsgDom = function(msg){
    let msgItem = document.createElement('div'); 
    chat_container.appendChild(msgItem);
    msgItem.classList.add('msgboxContR');

    let msgBoxChild = document.createElement('div');
    msgBoxChild.classList.add('user',"msg");
    msgItem.appendChild(msgBoxChild);

    let text_box = document.createElement("p");
    text_box.textContent = msg;
    msgBoxChild.appendChild(text_box);
}

function valueChange(element){
    let theNext = element.parentElement.parentElement.querySelector('.zvalue');
    theNext.classList.remove("trans");
    theNext.textContent = element.value;
}
function valueHide(element){
    let theNext = element.parentElement.parentElement.querySelector('.zvalue');
    theNext.classList.add("trans");
}

function toggleChatBar(element){
    apiContoleBar.classList.toggle("trans");
    chatSettings.classList.toggle("active");
}

function toggleSideBar(element){
    sidebarbox.classList.toggle("active");
    sidebarToggler.classList.toggle("opened");
}

function showPopUp(e){
    e.classList.remove('trans');
}
function hidePopUp(e){
    e.classList.add('trans');
}

const isSafari = ()=>{return (!!window.ApplePaySetupFeature || !!window.safari) && agentHas("Safari") && !agentHas("Chrome") && !agentHas("CriOS")};
const isChrome = ()=>{return agentHas("CriOS") || agentHas("Chrome") || !!window.chrome};
const isFirefox = ()=>{return agentHas("Firefox") || agentHas("FxiOS") || agentHas("Focus")};
const isEdge = ()=> {return agentHas("Edg")};
const isOpera = ()=>{ return agentHas("OPR")};
const isVivaldi = ()=>{return agentHas("Vivaldi")};
function agentHas(keyword) {
    return navigator.userAgent.toLowerCase().search(keyword.toLowerCase()) > -1;
}


const showDonateNoti = ()=>{
    donateNoti.classList.add("active");
}
const hideDonateNoti = ()=>{
    setTimeout(() => {
        donateNoti.classList.remove("active");
    }, 10000);
}
const resetDate = ()=>{
    if(today != dailyUsage.date){
        dailyUsage.tokens = 0;
        dailyUsage.date = today;
        dailyUsage.notification = "no";
        window.localStorage.dailyUsage = JSON.stringify(dailyUsage);
    }
    
}
const addtokens = (tokensNum)=>{
    dailyUsage.tokens += Math.floor(((tokensNum*10)/7));
    window.localStorage.dailyUsage = JSON.stringify(dailyUsage);
}
const donateNotif = ()=>{
    if(dailyUsage.notification == "no" && dailyUsage.tokens > "500"){
        startNoti()
        // dailyUsage.notification = "yes";
        window.localStorage.dailyUsage = JSON.stringify(dailyUsage);
    }
}
const startNoti = composer(showDonateNoti, hideDonateNoti);
const tokensAddNoti = composer(addtokens, donateNotif);



const setMode = ()=>{
    if(settings.mode == "light"){
        document.documentElement.classList.remove("dark");
        modeCheckBox.checked = false;
    }else{
        document.documentElement.classList.add("dark");
        modeCheckBox.checked = true;
    }
}
const checkModeChange = ()=>{
    if(modeCheckBox.checked){
        settings.mode = "dark";
        window.localStorage.settings = JSON.stringify(settings)
    }else{
        settings.mode = "light";
        window.localStorage.settings = JSON.stringify(settings)
    }
}
const saveSettings = composer(checkModeChange, setMode)



const collectMsgs = ()=>{
    let allMsgs = [...document.querySelectorAll(".msg")]
    return allMsgs
}

const startJSON = (msgs)=>{
    let jsonObject = {
        chat: [],
        version: 1
    }
    return {msgs, jsonObject}
}
const startTxt = (msgs)=>{
    let txtObject = [];
    return {msgs, txtObject}
}

const jsonFormate = (obj)=>{
    obj.msgs.forEach((ele)=>{
        obj.jsonObject.chat.push({
            type: ele.classList[0].toUpperCase(),
            msg: ele.textContent
        })        
    })
    return obj.jsonObject
}
const txtFormate = (obj)=>{
    obj.msgs.forEach((ele)=>{
        obj.txtObject.push(`${ele.classList[0].toUpperCase().padEnd(4)}${":".padEnd(3)} ${ele.textContent}\n`);
    })
    return obj.txtObject
}

const makeJSONfile = (jsonF)=>{
    let blob = new Blob([JSON.stringify(jsonF)], {type: "json"});
    return blob
}
const makeTXTfile = (txtF)=>{
    let blob = new Blob(txtF, {type: "txt"});
    return blob
}

const downloadMsgsFile = (file)=>{
    let url = window.URL.createObjectURL(file);
    let currentTime = (new Date).getTime();

    let downloadEle = document.createElement('a');
    downloadEle.href = url;
    downloadEle.download = `chatExport${currentTime}.${file.type}`;

    document.body.appendChild(downloadEle);
    downloadEle.click();

    return {url, downloadEle}
}
const clearAfterDownlod = (objToDel)=>{
    window.URL.revokeObjectURL(objToDel.url);
    objToDel.downloadEle.remove();
}
const msgsJSONgenerateDownload = composer(collectMsgs, startJSON, jsonFormate, makeJSONfile, downloadMsgsFile, clearAfterDownlod);
const msgsTXTgenerateDownload = composer(collectMsgs, startTxt, txtFormate, makeTXTfile, downloadMsgsFile, clearAfterDownlod);

















let fetchAPI = getAPIReady();
async function getAPIReady(){
    let callingKfromServices = null;

    // let ip = await fetch('https://api.ipify.org/?format=json');
    // ip = await ip.json()

    const checkIsUserFake = await fetch("https://gptcorestudio-service.vercel.app/gptcorestudio-server/zchatgpt/openai", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userIp: null,
            loggDate: new Date()
        })
    });
    let data = await checkIsUserFake.json();
    callingKfromServices = data;

    async function fetchAPIfunction(msg, fun){
        const response = await fetch(URL,{
            method: "POST",
            headers: {
                'Authorization': `Bearer ${callingKfromServices.dot}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: modelInput.value,
                messages: [{role: roleInput.value, content: msg}],
                stream: true,
                temperature: +rangeInputs[0].value,
                top_p: +rangeInputs[1].value,
                presence_penalty: +rangeInputs[2].value,
                frequency_penalty: +rangeInputs[3].value,
                max_tokens: 200
            }),
        });
    
        const reader = response.body.getReader(); // getting reader on response
        const decoder = new TextDecoder("utf-8");
        fun()
    
        let tokensNum = 0;
        let full_response = "";
    
        while(true){ // loop on the reader chunks
            const chunk = await reader.read() // read reader
            const {done, value} = chunk;
            if(done){
                break
            }
            const decoded = decoder.decode(value); // decode
            const lines = decoded.split("\n");
            const filteredLines = lines
            .map((line) => line.replace(/^data: /,"").trim())
            .filter((line) => line !== "" && line !== "[DONE]")
            .map((line) => JSON.parse(line))
            .map((line) =>{
                tokensNum+=gptMsgPusher(line);
                full_response+=extract_text_from_response(line);
            });
            scrollToBottomOfElement()
        }
        tokensAddNoti(tokensNum);
        opened_chat_id = current_chat_id.getAttribute("current_chat_id");
        push_ai_message_into_db(opened_chat_id, full_response);
    }
    fetchAPI = fetchAPIfunction
    return fetchAPI
}


function scrollToBottomOfElement() {
    msgCont.scrollTop = msgCont.scrollHeight;
}

function hide_welcomeBox(){
    welcomeBox.classList.add('trans');
}
function show_welcomeBox(){
    welcomeBox.classList.remove('trans');
}


try{
    submitBTN.addEventListener('click', async()=>{
        let input = textInput.value;
        if(input.length == 0) return;
        let opened_chat_id = current_chat_id.getAttribute("current_chat_id");

        // Check if there is opened chat, so we can put messages in its object in db
        if(chat_container.children.length >= 0 && opened_chat_id.length > 0){
            hide_welcomeBox();
            push_user_message_into_db(opened_chat_id, input);
        } else if(chat_container.children.length == 0 && opened_chat_id.length == 0){
            // if else, so we need to open a new chat
            await start_new_chat_on_send();
            opened_chat_id = current_chat_id.getAttribute("current_chat_id");
            push_user_message_into_db(opened_chat_id, input);
        }

        textInput.value = '';
        userMsgDom(input);
        addtokens(input.split(" ").length);
        fetchAPI(input, gptMsgDom);
    })
}catch(e){}



















document.body.onload = ()=>{
    preload();
    newUpadate();
    resetDate();
    setMode();
};


(function (){

    sidebarToggler.addEventListener('click', toggleSideBar)

    chatSettings.addEventListener('click', toggleChatBar);

    donateOpen.addEventListener('click', ()=>{
        showPopUp(donationPop);
    });
    donateClose.addEventListener('click', ()=>{
        hidePopUp(donationPop);
    });

    settingsOpen.addEventListener('click', ()=>{
        settingsOpen.classList.toggle('active');
        showPopUp(settingsPop);
    });
    settingsClose.addEventListener('click', ()=>{
        settingsOpen.classList.toggle('active');
        hidePopUp(settingsPop);
    });
    modeCheckBox.addEventListener('click', ()=>{
        saveSettings();
    })

    exportOpen.addEventListener('click', ()=>{
        showPopUp(exportPop);
    });
    exportClose.addEventListener('click', ()=>{
        hidePopUp(exportPop);
    });
    jsonFormateExport.addEventListener('click', ()=>{
        msgsJSONgenerateDownload();
    });
    txtFormateExport.addEventListener('click', ()=>{
        msgsTXTgenerateDownload();
    });

    rangeInputs.forEach((ele)=>{
        ele.addEventListener('input', ()=>{
            valueChange(ele);
        })
        ele.addEventListener('mouseup', ()=>{
            valueHide(ele);
        })
    })
}());
