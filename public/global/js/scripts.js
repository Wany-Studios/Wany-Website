const SERVER = "http://localhost:3000/";

function handleResponseError(name, error) {
    switch (name) {
        case "UsernameOrEmailRequired":
            alert("Campo de usuário ou email obrigatório!");
            break;

        case "UsernameOrEmailEmpty":
            alert("Campo de usuário ou email não pode estar vazio!");
            break;

        case "UsernameOrEmailInvalid":
            alert("Campo de usuário ou email não é válido!");
            break;

        case "PasswordRequired":
            alert("Campo de senha é obrigatório!");
            break;

        case "PasswordEmpty":
            alert("Campo de senha não pode estar vazio!");
            break;

        case "UserNotFound":
            alert("Usuário não encontrado!");
            break;

        case "UnableLogin":
            alert("Não foi possível se autenticar!");
            break;

        case "UnableRegister":
            alert("Não foi possível se autenticar!");
            break;

        case "UnableGoogleRegister":
            alert("Não foi possível se autenticar!");
            break;

        case "UnrecognizedError":
            alert(`Erro desconhecido: ${error}!`);
            break;

        default:
            alert(error);
    }
}
