var loginModal = document.getElementById("loginModal");
var openLoginBtn = document.getElementById("openLogin");
var closeLoginBg = document.getElementById("closeLogin");
var closeLoginX = document.getElementById("closeLoginX");
var registerModal = document.getElementById("registerModal");
var closeRegisterBg = document.getElementById("closeRegister");
var closeRegisterX = document.getElementById("closeRegisterX");
var openRegisterFromLogin = document.getElementById("openRegisterFromLogin");
var openLoginFromRegister = document.getElementById("openLoginFromRegister");
function setBodyBlur(on) {
    document.body.classList.toggle("modal-open", on);
}
function openModal(modal) {
    if (!modal)
        return;
    modal.classList.add("is-open");
    modal.setAttribute("arria-hidden", "false");
    setBodyBlur(true);
}
function closeModal(modal) {
    var _a, _b;
    if (!modal)
        return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    // ako niti jedan modal nije otvoren maknem blur
    var anyOpen = ((_a = loginModal === null || loginModal === void 0 ? void 0 : loginModal.classList.contains("is-open")) !== null && _a !== void 0 ? _a : false) ||
        ((_b = registerModal === null || registerModal === void 0 ? void 0 : registerModal.classList.contains("is-open")) !== null && _b !== void 0 ? _b : false);
    if (!anyOpen)
        setBodyBlur(false);
}
// LOGIN open/close
openLoginBtn === null || openLoginBtn === void 0 ? void 0 : openLoginBtn.addEventListener("click", function () { return openModal(loginModal); });
closeLoginBg === null || closeLoginBg === void 0 ? void 0 : closeLoginBg.addEventListener("click", function () { return closeModal(loginModal); });
closeLoginX === null || closeLoginX === void 0 ? void 0 : closeLoginX.addEventListener("click", function () { return closeModal(loginModal); });
//REGISTER open/close
closeRegisterBg === null || closeRegisterBg === void 0 ? void 0 : closeRegisterBg.addEventListener("click", function () { return closeModal(registerModal); });
closeRegisterX === null || closeRegisterX === void 0 ? void 0 : closeRegisterX.addEventListener("click", function () { return closeModal(registerModal); });
//Prebacivanje iz jednog modala u drugi
openRegisterFromLogin === null || openRegisterFromLogin === void 0 ? void 0 : openRegisterFromLogin.addEventListener("click", function () {
    closeModal(loginModal);
    openModal(registerModal);
});
openLoginFromRegister === null || openLoginFromRegister === void 0 ? void 0 : openLoginFromRegister.addEventListener("click", function () {
    closeModal(registerModal);
    openModal(loginModal);
});
//zatvaranje na ESC tipku
document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape")
        return;
    closeModal(loginModal);
    closeModal(registerModal);
});
//sprijeciti da submit reloada stranicu
var loginForm = document.getElementById("loginForm");
loginForm === null || loginForm === void 0 ? void 0 : loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // TODO: fetch login
});
var registerForm = document.getElementById("registerForm");
registerForm === null || registerForm === void 0 ? void 0 : registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // TODO: fetch register
});
console.log("login.ts loaded");
