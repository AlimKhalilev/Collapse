class GUI {
    static espState = false;
    static distanceState = false;

    static changeHandleState(state, handleName, guiContainer) {
        let handleObject = guiContainer.querySelector(`.guiPlayer__${handleName}`);

        if (handleObject !== null) {
            if (state) {
                handleObject.classList.add("active");
            }
            else {
                handleObject.classList.remove("active");
            }
        }
    }

    static initBasicToggler(handle, handleName, guiContainer) {
        this.changeHandleState(handle.checked, handleName, guiContainer);

        handle.addEventListener("change", () => {
            if (this.espState && this.distanceState) {
                if (handleName !== "weapon") {
                    this.changeHandleState(handle.checked, handleName, guiContainer);
                }
            }
        });
    }

    static toggleAllPlayerElems(guiContainer, state) {
        guiContainer.querySelectorAll("[data-handle]").forEach(handle => {
            let handleState = (state ? handle.checked : false);
            this.changeHandleState(handleState, handle.dataset.handle, guiContainer)
        });
    }

    static enableWeaponToggler(handleInventory, handleWeapon, handlePlayerWeapon) { // отдельная логика для weapon и inventory
        if (handleInventory) { // если есть переключатель Inventory
            if (handleInventory.checked) { // если при инициализации есть handleWeapon, и переключатель Inventory выделен 
                handlePlayerWeapon.classList.add("active");
                handlePlayerWeapon.classList.add("success");
            }

            handleInventory.addEventListener("change", () => {
                handlePlayerWeapon.classList.toggle("success", handleInventory.checked);
    
                if ((!handleWeapon) || (!handleWeapon.checked && !handleInventory.checked)) { // если нет тумблера weapon, или если оба тумблера выключены
                    handlePlayerWeapon.classList.remove("active"); // вырубаем weapon gui (автоматически вырублен будет и inventory)
                }
                if (handleInventory.checked) { // если включаем inventory, то в любом случае включаем weapon gui
                    handlePlayerWeapon.classList.add("active");
                }
            });
        }

        if (handleWeapon) { // если есть переключатель Weapon
            handleWeapon.addEventListener("change", () => {
                if (!handleInventory || !handleInventory.checked) { // если нет тумблера inventory, или если тумблер inventory вырублен (только тогда взаимодействуем с gui weapon)
                    handlePlayerWeapon.classList.toggle("active", handleWeapon.checked); // врубаем только тогда, когда weapon чекнут
                }
            });
        }

    }

    static initEvents() {
        document.querySelectorAll(".guiContainer").forEach(guiContainer => {

            let espHandle = guiContainer.querySelector(".guiColumn__toggler.c-checkbox__input");
            this.espState = espHandle.checked;
            
            espHandle.addEventListener("change", () => {
                this.espState = espHandle.checked;
                this.toggleAllPlayerElems(guiContainer, this.espState && this.distanceState);
            });

            let distanceHandle = guiContainer.querySelector(".guiColumn__toggler.guiColumn__progressTrack");
            let distanceValue = +guiContainer.querySelector(".guiPlayer__distance").innerHTML || 231;
            this.distanceState = (+distanceHandle.value >= distanceValue);
            
            distanceHandle.addEventListener("change", () => {
                let distanceValue = +guiContainer.querySelector(".guiPlayer__distance").innerHTML || 231;
                this.distanceState = (+distanceHandle.value >= distanceValue);

                this.toggleAllPlayerElems(guiContainer, this.espState && this.distanceState);
            });

            guiContainer.querySelectorAll("[data-handle]").forEach(handle => {
                this.initBasicToggler(handle, handle.dataset.handle, guiContainer);
            });

            // работаем с отдельным функционалом inventory и weapon

            let handleInventory = guiContainer.querySelector("[data-handle='inventory']");
            let handleWeapon = guiContainer.querySelector("[data-handle='weapon']");
            let handlePlayerWeapon = guiContainer.querySelector(".guiPlayer__weapon");

            this.enableWeaponToggler(handleInventory, handleWeapon, handlePlayerWeapon);
        });
    }
}

GUI.initEvents();