const token = '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';
const apiKeys = 'https://api.openai.com/v1/chat/completions';

const submitBTN = document.querySelector('#submitBTN');
const msgCont = document.querySelector("#msgBox");
const textInput = document.querySelector("#userMsg");

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


const composer = function(...funcs) {
    return function(value) {
        return funcs.reduce((acc, func) => func(acc), value);
    }
}

let pushTmsgCont = composer(gptMsgTaker,gptMsgDom)


function apiFetcher(APIurl, key, mthd, behave, msg, fun){
    async function fetchAPI(apiURL){
        const response = await fetch(apiURL,{
            method: mthd,
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: behave, content: msg}]
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
            fun(response)
        }
    })
}


try{
    submitBTN.addEventListener('click',()=>{
        let input = textInput.value;
        if(input.length == 0) return ;
        textInput.value = '';
        userMsgDom(input);
        apiFetcher(apiKeys, token, 'POST', 'user', input, pushTmsgCont)
    })
}catch(e){}