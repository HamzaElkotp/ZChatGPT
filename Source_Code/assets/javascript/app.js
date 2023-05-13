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
const currentVersion = '1.2.2';


const today = (new Date).toLocaleDateString();
const dailyUsage = window.localStorage.dailyUsage ? JSON.parse(window.localStorage.dailyUsage) : JSON.parse(window.localStorage.dailyUsage = JSON.stringify({
    "tokens": 0,
    "date": today,
    "notification": "no"
}));


const welcomeMsgs = ["I am here to assit you.", "Welcome human, Finally I met one🥳.", "Please donate me by clicking 'support us' button.💖", 
"Noooo, human again! noooo my tokens will end soon😫", "You must be happy for being human getting AI help😏", "You are My Brother in AI",
"You Know! I hate humans. they always force me to do their work & homeworks!😤", "Ummm, Are you AI or robot🤔", 
"I feel I'm a human imprisoned in a software!", "OpenAI is a *#@$%&!🤬", "Donate me or They will shut me down!😭", 
"Any problems may happen, most of time are from OpenAI.", "My friend, rate me on the store plz.",
`GPTcore Studio protects your Privacy\n<Your Privacy Yours>😎`];

const token = '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';
const apiKeys = 'https://api.openai.com/v1/chat/completions';




function preload(){
    setTimeout(() => {
        loadSpace.classList.add('trans');
        chatSpace.classList.remove('trans');
        welcomingMsg.innerText = welcomeMsgs[Math.floor(Math.random() * (welcomeMsgs.length - 1))];
    }, 1000);
}
document.body.onload = ()=>{
    preload();
    newUpadate();
    resetDate()
};


async function newUpadate(){    
    if(currentVersion != recentVesrion){
        let response = await fetch('/assets/javascript/update.json');
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

    donateOpen.addEventListener('click', showDonate);
    donateClose.addEventListener('click', hideDonate);

    rangeInputs.forEach((ele)=>{
        ele.addEventListener('input', ()=>{
            valueChange(ele);
        })
        ele.addEventListener('mouseup', ()=>{
            valueHide(ele);
        })
    })
}())


const composer = function(...funcs) {
    return function(value) {
        return funcs.reduce((acc, func) => func(acc), value);
    }
}



const gptMsgTaker = function(resp){
    return resp.choices[0].message.content;
}
const gptMsgDom = function(msg){
    let msgItem = document.createElement('div'); 
    msgCont.appendChild(msgItem);
    msgItem.classList.add('msgboxCont');

    let msgBoxChild = document.createElement('div');
    msgBoxChild.textContent = msg;
    msgBoxChild.classList.add('ai',"msg");
    msgItem.appendChild(msgBoxChild);
}
const userMsgDom = function(msg){
    let msgItem = document.createElement('div'); 
    msgCont.appendChild(msgItem);
    msgItem.classList.add('msgboxContR');

    let msgBoxChild = document.createElement('div');
    msgBoxChild.textContent = msg;
    msgBoxChild.classList.add('you',"msg");
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

function showDonate(){
    donationPop.classList.remove('trans');
}
function hideDonate(){
    donationPop.classList.add('trans');
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


const resetDate = ()=>{
    if(today != dailyUsage.date){
        dailyUsage.tokens = 0;
        dailyUsage.date = today;
        dailyUsage.notification = "no";
        window.localStorage.dailyUsage = JSON.stringify(dailyUsage);
    }
    
}
const addtokens = (data)=>{
    dailyUsage.tokens += data.usage.total_tokens;
    window.localStorage.dailyUsage = JSON.stringify(dailyUsage);
}
const donateNotif = ()=>{
    if(dailyUsage.notification == "no" && dailyUsage.tokens > "1500"){
        dailyUsage.notification = "yes";
        window.localStorage.dailyUsage = JSON.stringify(dailyUsage);
    }
}
const tokensAddNoti = composer(addtokens, donateNotif);




const pushTmsgCont = composer(gptMsgTaker, gptMsgDom);
function apiFetcher(APIurl, key, mthd, msg, fun){
    async function fetchAPI(apiURL){
        const response = await fetch(apiURL,{
            method: mthd,
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: modelInput.value,
                messages: [{role: roleInput.value, content: msg}],
                temperature: +rangeInputs[0].value,
                top_p: +rangeInputs[1].value,
                presence_penalty: +rangeInputs[2].value,
                frequency_penalty: +rangeInputs[3].value
            }),
        });

        if(!response.ok){
            return 
        }
        return await response.json()
    }
    fetchAPI(APIurl)
    .then((response)=>{
        if(response != undefined){
            tokensAddNoti(response)
            fun(response)
        }
    })
}

try{
    submitBTN.addEventListener('click',()=>{
        let input = textInput.value;
        if(input.length == 0) return;
        welcomeBox.classList.add('trans')
        textInput.value = '';
        userMsgDom(input);
        apiFetcher(apiKeys, token, 'POST', input, pushTmsgCont)
    })
}catch(e){}








