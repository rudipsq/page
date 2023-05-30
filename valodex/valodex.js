let themeArray = null;
let skinArray = null;

function getApiSkins(){
    fetch('https://valorant-api.com/v1/weapons/skins')
    .then(response => response.json())
    .then(responseData => {
        const dataArray = responseData.data;
        const filteredData = dataArray.map(item => {
        // Filter out specific subcategories or properties
        return {
            uuid: item.uuid,
            theme: item.themeUuid,
            name: item.displayName
        };
    });
    
    const jsonString = JSON.stringify(filteredData);
    //console.log(jsonString); // Display the JSON string in the console

    skinArray = JSON.parse(jsonString);
    })
    .catch(error => {
        console.log('Error:', error);
    });
}
// icon: "https://media.valorant-api.com/weaponskins/" + uuid + "/displayicon.png"



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
            td_name.textContent = weaponNameFromString(skin.name);
        
            const td_image = document.createElement("td");
            td_image.classList.add("image_td");
            const image = document.createElement("img");
            image.src = "https://media.valorant-api.com/weaponskins/" + skin.uuid + "/displayicon.png";
            td_image.appendChild(image);

            const td_button = document.createElement("td");
            td_button.classList.add("collect_button_td");
            const button = document.createElement("button");


            let jsonString = localStorage.getItem('valodex_collected');
            // if(jsonString == null) console.log("ok supi supi, looks like u r new")
            if(jsonString.includes(skin.uuid+'":true')){
                button.textContent = 'remove';
                button.style.backgroundColor = "#66d2ef";
            } else{
                button.textContent = 'add';
                button.style.backgroundColor = "#00d600";
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
        clickedButton.style.backgroundColor = '#66d2ef';
    }
    else if(jsonObject[uuid] != true){
        jsonObject[uuid] = true;
        clickedButton.style.backgroundColor = '#66d2ef';
        clickedButton.textContent = 'remove';
        }
    else{
        jsonObject[uuid] = false;
        clickedButton.style.backgroundColor = '#00d600';
        clickedButton.textContent = 'add';
    }

    jsonString = JSON.stringify(jsonObject);
    localStorage.setItem('valodex_collected', jsonString);
}

// when button is pressed and item is added to the list make button other color to remove it
// add counter to count all collected guns
// maybe adjust size of the images

startPage()

async function startPage(){
    let jsonString = localStorage.getItem('valodex_collected');
    if(jsonString == null) localStorage.setItem('valodex_collected', '{"1": "1"}')
    try {
        await getApiThemes();
        try {
            await getApiSkins();
            setTimeout(function() {
                addThemesToWebsite();
              }, 500);
        } catch (error) {
            console.error('Error:', error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}