let themeArray = null;
let skinArray = null;

function getApiSkins(){
    fetch('https://valorant-api.com/v1/weapons/skins')
    .then(response => response.json())
    .then(responseData => {
        const dataArray = responseData.data;
        const filteredData = dataArray.map(item => {
        // Filter out specific properties



        if(item.displayIcon == null){

            const jsonArraychromas = item.chromas;
            for (let image of jsonArraychromas) {
                return {
                    uuid: item.uuid,
                    theme: item.themeUuid,
                    name: item.displayName,
                    image: image.fullRender
                };
            }
        } else{
            return {
                uuid: item.uuid,
                theme: item.themeUuid,
                name: item.displayName,
                image: item.displayIcon
            };
        }
    });
    
    const jsonString = JSON.stringify(filteredData);

    skinArray = JSON.parse(jsonString);
    })
    .catch(error => {
        console.log('Error:', error);
    });
}


function getApiThemes(){
    fetch('https://valorant-api.com/v1/themes')
    .then(response => response.json())
    .then(responseData => {
        const dataArray = responseData.data;
        const filteredData = dataArray.map(item => {
        // Filter out specific subcategories or properties
        return {
            theme: item.uuid,
            name: item.displayName
        };
    });
    
    const jsonString = JSON.stringify(filteredData);
    //console.log(jsonString); // Display the JSON string in the console

    themeArray = JSON.parse(jsonString);
    })
    .catch(error => {
        console.log('Error:', error);
    });
}


function addThemesToWebsite(){
    const container = document.getElementById("themes_container");

    // Iterate over the JSON array
    for (let item of themeArray) {
        // Create a new div element
        const div = document.createElement("div");
        div.classList.add("themes")

        const heading = document.createElement("h3");
        heading.textContent = item.name;
        div.appendChild(heading);

        const table = document.createElement("table");


        // for all skins with theme_uuid = uuid of current theme
        let currentUuidSkins = searchArrayByKey(skinArray, "theme", item.theme)
        for (let skin of currentUuidSkins){
            const tr = document.createElement("tr");
            const td_name = document.createElement("td");
            td_name.classList.add("name_td");
            const weaponName = weaponNameFromString(skin.name);
            td_name.textContent = weaponName;
        
            const td_image = document.createElement("td");
            td_image.classList.add("image_td");
            const image = document.createElement("img");
            if(weaponName == "Bucky"){
                image.style.height = "28px";
            }
            if(weaponName == "Ghost" || weaponName == "Guardian"){
                image.style.height = "36px";
            }
            if(weaponName == "Shorty"){
                image.style.height = "32px";
            }
            if(weaponName == "Phantom"){
                image.style.height = "38px";
            }
            if(weaponName == "Marshal"){
                image.style.height = "36px";
            }

            //check if image exists:
            // const url = "https://media.valorant-api.com/weaponskins/" + skin.uuid + "/displayicon.png";
            // const img = new Image();
            // img.src = url;
            // img.onload = function() {
            //     image.src = url;
            // };
            // img.onerror = function() {
            //     image.src = "images/icons/skins_noGun.png";
            // };
            if(skin.hasOwnProperty('image')){
                image.src = skin.image;
            } else{
                image.src = "https://media.valorant-api.com/weaponskins/" + skin.uuid + "/displayicon.png";
            }
            td_image.appendChild(image);

            const td_button = document.createElement("td");
            td_button.classList.add("collect_button_td");
            const button = document.createElement("button");

            let jsonString = localStorage.getItem('valodex_collected');
            if(jsonString.includes(skin.uuid+'":true')){
                button.textContent = 'remove';
                button.classList.add("remove_collection_button");
            } else{
                button.textContent = 'add';
                button.classList.add("add_collection_button");
            }
            button.addEventListener('click', function() {
                triggerCollected(skin.uuid);
              });
            td_button.appendChild(button);

            tr.appendChild(td_name)
            tr.appendChild(td_image)
            tr.appendChild(td_button)
            table.appendChild(tr)
        }


        div.appendChild(table)
        // Append the div element to the container
        if(currentUuidSkins.length > 0 && item.name != "Random" && item.name != "Standard") container.appendChild(div);
    }
}

function searchArrayByKey(jsonArray, key, value) {
    return jsonArray.filter(obj => obj[key] === value);
}

function weaponNameFromString(string){
    if (string.includes("Classic")) return "Classic"
    else if (string.includes("Shorty")) return "Shorty"
    else if (string.includes("Frenzy")) return "Frenzy"
    else if (string.includes("Ghost")) return "Ghost"
    else if (string.includes("Sheriff")) return "Sheriff"
    else if (string.includes("Stinger")) return "Stinger"
    else if (string.includes("Spectre")) return "Spectre"
    else if (string.includes("Bucky")) return "Bucky"
    else if (string.includes("Judge")) return "Judge"
    else if (string.includes("Bulldog")) return "Bulldog"
    else if (string.includes("Guardian")) return "Guardian"
    else if (string.includes("Phantom")) return "Phantom"
    else if (string.includes("Vandal")) return "Vandal"
    else if (string.includes("Marshal")) return "Marshal"
    else if (string.includes("Operator")) return "Operator"
    else if (string.includes("Ares")) return "Ares"
    else if (string.includes("Odin")) return "Odin"
    else return string
}

function triggerCollected(uuid){
    let jsonString = localStorage.getItem('valodex_collected');
    let jsonObject = JSON.parse(jsonString);
    const clickedButton = event.target;

    console.log(jsonString)
    console.log(jsonObject)

    if(jsonObject == null){
        jsonObject = {[uuid]:true};
        clickedButton.classList.remove("add_collection_button");
        clickedButton.classList.add("remove_collection_button");
    }
    else if(jsonObject[uuid] != true){
        jsonObject[uuid] = true;
        clickedButton.classList.remove("add_collection_button");
        clickedButton.classList.add("remove_collection_button");
        clickedButton.textContent = 'remove';
        }
    else{
        jsonObject[uuid] = false;
        clickedButton.classList.remove("remove_collection_button");
        clickedButton.classList.add("add_collection_button");
        clickedButton.textContent = 'add';
    }

    jsonString = JSON.stringify(jsonObject);
    localStorage.setItem('valodex_collected', jsonString);

    const counter = document.getElementById("counter");
    counter.textContent = "collected: " + updateCollectedCounter()
}

function updateCollectedCounter(){
    let jsonString = localStorage.getItem('valodex_collected');
    let jsonObject = JSON.parse(jsonString);
    let count = 0;

    for (const key in jsonObject) {
        if (jsonObject.hasOwnProperty(key) && jsonObject[key] === true) {
          count++;
        }
    }
    return count;
}


function changeViewMode(image){
    let container = document.getElementById("themes_container")

    if (image.src.endsWith('images/icons/menu_grid.png')){
        image.src = 'images/icons/menu_list.png';
        localStorage.setItem('valodex_viewMode', '{"mode": "list"}')

        container.classList.remove("themes_container_grid")
    } else{
        image.src = 'images/icons/menu_grid.png';
        localStorage.setItem('valodex_viewMode', '{"mode": "grid"}')

        container.classList.add("themes_container_grid")
    }
}

function copyBackUpKey() {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = localStorage.getItem('valodex_collected');
  
    // Append the textarea to the document body
    document.body.appendChild(textarea);
  
    // Select the text in the textarea
    textarea.select();
  
    // Copy the selected text to the clipboard
    document.execCommand('copy');
  
    // Remove the temporary textarea from the document
    document.body.removeChild(textarea);
}



startPage()

async function startPage(){
    let jsonString_viewMode = localStorage.getItem('valodex_viewMode');
    if(jsonString_viewMode == null) localStorage.setItem('valodex_viewMode', '{"mode": "list"}')
    if(jsonString_viewMode == '{"mode": "grid"}'){
        let image_viewMode = document.getElementById("viewmode_icon");
        changeViewMode(image_viewMode);
    }


    let jsonString = localStorage.getItem('valodex_collected');
    if(jsonString == null) localStorage.setItem('valodex_collected', '{"vdex_version": "1"}')

    try {
        await getApiThemes();
        try {
            await getApiSkins();
            setTimeout(function() {
                addThemesToWebsite();

                const counter = document.getElementById("counter");
                counter.textContent = "collected: " + updateCollectedCounter()
              }, 1000);                  //your internet might me to slow and this website isn't optimized
        } catch (error) {
            console.error('Error:', error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// add total number of skins to counter
// larger image when clicked on image
// small animation if button pressed
// menu bar on top: change view mode from list to table, show completed collections, show total collected skins,
//                  option to create a backup and to upload a backup