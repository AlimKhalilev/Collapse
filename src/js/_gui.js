class GUI {
    static exceptionList = ["esp", "distance", "distanceToggle"];

    static exceptionBranching(handle, handleName, guiContainer) {
        let playerDistance = +guiContainer.querySelector(".guiPlayer__distance").innerHTML || 231;
        let playerDistanceToggle = guiContainer.querySelector(".guiColumn__distanceToggle");
        let playerDistanceOverlay = guiContainer.querySelector(".guiPlayer__distanceOverlay");

        this.changeHandleState(playerDistanceToggle, "distanceOverlay", guiContainer);

        handle.addEventListener("change", () => {
            if (handleName === "esp") {
                guiContainer.querySelectorAll(".guiColumn__handle").forEach(handleElem => {
                    handleElem.checked = handle.checked;

                    let handleSwitchedName = this.getHandleNameByClassList(handleElem.classList);
                    this.changeHandleState(handleElem, handleSwitchedName, guiContainer);
                });
                
                if (handle.checked) {
                    guiContainer.querySelector(".guiColumn__progress").classList.remove("disabled");

                    let distance = guiContainer.querySelector(".guiColumn__progress .guiColumn__distance");
                    distance.value = +distance.attributes.max.value; // при включении присвоить макс. знач. progress
                }
                else {
                    guiContainer.querySelector(".guiColumn__progress").classList.add("disabled");
                }

                this.changeHandleState(playerDistanceToggle, "distanceOverlay", guiContainer);
            }

            if (handleName === "distance") {

                guiContainer.querySelectorAll(".guiColumn__handle").forEach(handleElem => {
                    if (handle.value <= playerDistance) {
                        if (!handleElem.classList.contains("guiColumn__distanceToggle")) {
                            handleElem.checked = false;

                            let handleSwitchedName = this.getHandleNameByClassList(handleElem.classList);
                            this.changeHandleState(handleElem, handleSwitchedName, guiContainer);
                        }

                    }

                });
            }

            if (handleName === "distanceToggle") {
                guiContainer.querySelector(".guiColumn__progress").classList.toggle("disabled");
                this.changeHandleState(playerDistanceToggle, "distanceOverlay", guiContainer);
            }
        });
    }

    static getHandleNameByClassList(classList) { // убираем лишние классы из списка и превращаем в строку
        let cleanArr = [...classList].filter(elem => elem.includes("guiColumn__") && !elem.includes("handle") && !elem.includes("progress")).join("");
        return cleanArr.substr(11, cleanArr.length - 11); // убираем префикс guiColumn__ в строке
    }

    static changeHandleState(handle, handleName, guiContainer) {
        let handleObject = guiContainer.querySelector(`.guiPlayer__${handleName}`);
        //console.log("Взаимодействуем с", handleName);

        if (handleObject !== null) {
            if (handle.checked) {
                handleObject.classList.add("active");
            }
            else {
                handleObject.classList.remove("active");
            }
        }
    }

    static initBasicToggler(handle, handleName, guiContainer) {
        this.changeHandleState(handle, handleName, guiContainer);

        handle.addEventListener("change", () => {
            guiContainer.querySelector(`.guiPlayer__${handleName}`).classList.toggle("active");
        });
    }

    static initEvents() {
        document.querySelectorAll(".guiContainer").forEach(guiContainer => {
            guiContainer.querySelectorAll(".guiColumn__handle").forEach(handle => {
                let handleName = this.getHandleNameByClassList(handle.classList);

                if (this.exceptionList.includes(handleName)) {
                    this.exceptionBranching(handle, handleName, guiContainer);
                }
                else {
                    this.initBasicToggler(handle, handleName, guiContainer);
                }
            });
        });
    }
}

GUI.initEvents();