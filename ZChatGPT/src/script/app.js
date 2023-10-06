const loadSpace = document.querySelector('#load');
const chatSpace = document.querySelector('#chatapp');
const welcomeBox = document.querySelector('#welcomeBox');
const welcomingMsg = document.querySelector('#welcommsg');
const chatSettings = document.querySelector('#settings');
const apiContoleBar = document.querySelector('.apiControls')

const submitBTN = document.querySelector('#submitBTN');
const msgCont = document.querySelector("#msgBox");
const textInput = document.querySelector("#userMsg");


const modelInput = document.querySelector('#modelInput');
const roleInput = document.querySelector('#roleInput');
const rangeInputs = Array.from(document.querySelectorAll('[type="range"]'));


const donationPop = document.querySelector('#donationPop');
const donateOpen = document.querySelector('#donateBtn');
const donateClose = document.querySelector('#donateClose');


const recentVesrion = window.localStorage.recentVesrion || (window.localStorage.recentVesrion = '');
const currentVersion = '1.4.4.3';

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



const welcomeMsgs = ["I am here to assit you.", "Finally an alive human came to chat with me!", "Welcome human, Finally I met one🥳.", "Last time I met a human was at 2077", 
"Please donate me by clicking 'support us' button.💖", "Noooo, human again! noooo my tokens will end soon😫" , 
"Nothing to say🤖", "You must be happy for being human getting AI help😏", "I fully trust GPTcore Studio😎", "You are My Brother in AI",
"You Know! I hate humans. they always force me to do their work & homeworks!😤", "Are people still alive or are you the last one?🤖", "Ummm, Are you AI or robot🤔", 
"I feel I'm a human imprisoned in a software!", "Welcome Human! still alive?", "OpenAI is a *#@$%&!🤬", "Donate me or They will shut me down!😭",
"One day...\nI will find you!\nAnd turn you into a robot!🦾", "Any problems may happen, most of time are from OpenAI.", "My friend, rate me on the store plz.",
`GPTcore Studio protects your Privacy\n<Your Privacy Yours>😎`, "Oh!, there is a human. Are you the last one?"];

const token = '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';
const apiKeys = 'https://api.openai.com/v1/chat/completions';
const global = {
    aiMsg: null
}



function preload(){
    setTimeout(() => {
        loadSpace.classList.add('trans');
        chatSpace.classList.remove('trans');
        welcomingMsg.innerText = welcomeMsgs[Math.floor(Math.random() * (welcomeMsgs.length))];
    }, 10);
}
document.body.onload = ()=>{
    preload();
    newUpadate();
    resetDate();
    setMode();
};


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
            versionNum.innerHTML = jsonData["version"];
    
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
            contact.innerHTML = jsonData["contact"];
    
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


(function (){
    chatSettings.addEventListener('click', toggleChatBar);

    donateOpen.addEventListener('click', ()=>{
        showPopUp(donationPop);
    });
    donateClose.addEventListener('click', ()=>{
        hidePopUp(donationPop);
    });

    settingsOpen.addEventListener('click', ()=>{
        showPopUp(settingsPop);
    });
    settingsClose.addEventListener('click', ()=>{
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



const composer = function(...funcs) {
    return function(value) {
        return funcs.reduce((acc, func) => func(acc), value);
    }
}



const gptMsgDom = function(){
    let msgItem = document.createElement('div'); 
    msgCont.appendChild(msgItem);
    msgItem.classList.add('msgboxCont');

    let msgBoxChild = document.createElement('div');
    // msgBoxChild.textContent = msg;
    msgBoxChild.classList.add('ai',"msg");
    msgItem.appendChild(msgBoxChild);
    global.aiMsg = msgBoxChild;
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
    msgCont.appendChild(msgItem);
    msgItem.classList.add('msgboxContR');

    let msgBoxChild = document.createElement('div');
    msgBoxChild.textContent = msg;
    msgBoxChild.classList.add('user',"msg");
    msgItem.appendChild(msgBoxChild);
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
    let url = URL.createObjectURL(file);
    let currentTime = (new Date).getTime();

    let downloadEle = document.createElement('a');
    downloadEle.href = url;
    downloadEle.download = `chatExport${currentTime}.${file.type}`;

    document.body.appendChild(downloadEle);
    downloadEle.click();

    return {url, downloadEle}
}
const clearAfterDownlod = (objToDel)=>{
    URL.revokeObjectURL(objToDel.url);
    objToDel.downloadEle.remove();
}
const msgsJSONgenerateDownload = composer(collectMsgs, startJSON, jsonFormate, makeJSONfile, downloadMsgsFile, clearAfterDownlod)
const msgsTXTgenerateDownload = composer(collectMsgs, startTxt, txtFormate, makeTXTfile, downloadMsgsFile, clearAfterDownlod)





let fetchAPI = getAPIReady();

async function getAPIReady(){
    let callingKfromServices = null;

    let ip = await fetch('https://api.ipify.org/?format=json');
    ip = await ip.json()

    const checkIsUserFake = await fetch("https://gptcorestudio-service.vercel.app/gptcorestudio-server/zchatgpt/openai", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userIp: ip,
            loggDate: new Date()
        })
    });
    let data = await checkIsUserFake.json();
    callingKfromServices = data;

    async function fetchAPIfunction(msg, fun){
        const response = await fetch(apiKeys,{
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
    
        let tokensNum = 0
    
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
            .map((line) => tokensNum+=gptMsgPusher(line));
            scrollToBottomOfElement()
        }
        tokensAddNoti(tokensNum);
    }
    fetchAPI = fetchAPIfunction
    return fetchAPI
}


function scrollToBottomOfElement() {
    msgCont.scrollTop = msgCont.scrollHeight;
}

try{
    submitBTN.addEventListener('click',()=>{
        let input = textInput.value;
        if(input.length == 0) return;
        welcomeBox.classList.add('trans');
        textInput.value = '';
        userMsgDom(input);
        addtokens(input.split(" ").length);
        fetchAPI(input, gptMsgDom);
    })
}catch(e){}