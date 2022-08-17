// const form = document.getElementById("reg-form");

// form.addEventListener("submit", registerUser);

// async function registerUser(e) {
//   e.preventDefault();
//   const name = document.getElementById("nameField").value;
//   const username = document.getElementById("userName").value;
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;
//   const re_password = document.getElementById("re-password").value;

//     const result = await fetch("/api/registration", {
//       method: "POST",
//       headers: {
//         "content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         "name": name,
//         "username": username,
//        "email": email,
//         "password": password,
//         "re_Password": re_password
//       })
//     }).then((res) => res.json())
//     console.log(result.body);
//   }
