<template>
  <div class="background">
    <div class="container mx-auto">
        <Header />
        <form @submit.prevent = login()>
            <p class='center text-lg-h5 mb-7'>Identifiez-vous</p>
            <div class="mb-2 center">Champs requis (*)</div>
            <input id="email" ref="email" type="email" placeholder="E-mail (*)" title="Renseignez votre email" required>
            <input id="password" ref="password" type="password" placeholder="Mot de passe (*)" title="Renseignez votre mot de passe" required>
            <div class="message-erreur">{{ message }}</div>
            <div class="container-button mx-auto mt-6 mb-15">
              <button id="login" type="submit" class="mx-5">Connexion</button>
              <v-divider light vertical></v-divider>
              <!--Router-link qui envoie vers le composant Signup -->
              <router-link :to="{name:'Signup'}" id="signup" class="mx-5" tag="button">S'inscrire</router-link>
            </div>
        </form>
    </div>
  </div>
</template>

<script>
// importation de la configuration de requête pour client non connecté
import {notConnectedClient} from "@/services/auth.js"
//import du header
import Header from '../components/Header.vue';


export default {
    name: 'Login',
    components: {
        Header
    },

    data() {
        return {
            // on déclare une variable vide par défault qui contiendra les messages d'erreur
            message: "",                                        
        };
    },

    methods: {
        // fonction de connexion
        login() {                                               
            const email = this.$refs.email.value;
            const password = this.$refs.password.value;

            // envoi de la requête non authentifié avec notConnectedClient
            notConnectedClient.post("/users/login", {           
                email,
                password
            })
            // si la requête est validée on genère un token
            .then((res) => {
            if(res.status === 200) {                            
                const groupomaniaUser = {
                    token: res.data.token
                }
                //on stocke dans le localStorage un item avec le token
                localStorage.setItem('groupomaniaUser', JSON.stringify(groupomaniaUser));
                // rechargement de la page pour re-analyser le localStorage et pouvoir être renvoyé vers le composant Home   
                location.reload();                                                          
            }
            })
            // si la requête a échouée, on affiche le message d'erreur envoyé par le back
            .catch((error) => {
                this.message = error.response.data.error;       
            })
        }
    }
}
</script>

<style scoped>
    .background{
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      min-height: 100vh;
    }

    .container{
        max-width: 500px;
        margin: 0;
        padding: 0;
    }
    .center {
        margin: 0 auto;
        font-weight: bold;
    }
    form{
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: baseline;
    }

    form input{
        margin: auto;
        width: 80%;
        font-size: 1.05rem;
        padding: 10px;
        margin-bottom: 15px;
        text-align: center;
        background-color: white;
        border: 1px rgba(0, 0, 0, 0.548) solid;
        border-radius: 15px;
    }

    .container-button{
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: baseline;
    }

    #login{
        padding: 6px 12px;
        font-size: 1.5rem;
        color: #ffffff;
        background-color: #122441;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #login:hover{
        transform: scale(1.1);
    }

    #signup{
        padding: 6px 12px 6px 6px;
        font-size: 1.3rem;
        color: black;
        background-color: transparent;
        /* #fd2d01*/
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #signup:hover{
        transform: scale(1.1);
    }

    .message-erreur{
        text-align: center;
        margin: auto;
        color: red;
        font-size: 1rem;
    }
</style>