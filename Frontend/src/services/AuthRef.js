// The Logout Algorithm When Token Disappears Would Be too long for Http,js
// I could opt for a much simpler route like "href = " since it would make sense
// like expo routing only works in app folder, so here would be rendered useless
// me dumbass on the past thinks reusing logout() in User Context would make sense
// but didnt since User Context only enclosed root layout inside of app, whereas components are
// not inside of app folder nor be children of root layout. 
// But since i persisted we have this, i had to study it again on how it works 
// but now ill just document it so i dont have to forget it again

let logoutCallback = null; //let cos itll change values (OF COURSE ITS OBVIOUS)

// called from User Context
export const setLogoutCallback = (callback) => { //callback holds the logout arrow function
  logoutCallback = callback; //logoutCallback became logout arrow function
};

//called from Http.js, triggers when token is expired
export const triggerLogout = () => {
  if (logoutCallback) {
    logoutCallback(); // since logoutCallback holds the logout, the system LOGS OUT
  }
};
