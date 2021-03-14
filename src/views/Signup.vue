<template>
    <div class="background">
    <div class="container mx-auto">
        <!--img src="../assets/icon-above-font-removebg-preview.png" alt="Groupomania logo"-->
        <HeaderSignLogin />
        <form @submit.prevent = signup()>
            <p class='center text-lg-h6 '>Inscrivez-vous dès maintenant !</p>
            <div class="mb-2 center">Champs requis (*)</div>
            <input id="nom" ref="nom" type="text" placeholder="Nom"  title="Renseignez votre nom">
            <input id="prenom" ref="prenom" type="text" placeholder="Prénom" title="Renseignez votre prénom">
            <input id="email" ref="email" type="email" placeholder="E-mail (*)" title="Renseignez votre email" required>
            <input id="password" ref="password" type="password" placeholder="Mot de passe (*)" title="Renseignez votre mot de passe" required>
            <input id="bio" ref="bio" type="text" placeholder="Bio" title="Renseignez une bio">
            <div class="message-erreur">{{ message }}</div>
            <div class="mx-auto mt-6 mb-15 abc">
                <button id="signup" type="submit" class="mx-5">Inscription</button>
                <v-divider light></v-divider>
                <p class="text-xl-caption center mb-n6">Déjà inscrit?</p>
                <router-link to="/" id="login" tag="button" class="mx-5">Connectez-vous</router-link>
            </div>
        </form>
    </div>
  </div>
</template>
<script>
import { notConnectedClient } from '../services/auth.js';
import HeaderSignLogin from '../components/HeaderSignLogin';

export default {
    name: "Signup",
    components: {
        HeaderSignLogin
    } ,
    data() {
        return {
            message: ""
        }
    },
    created(){
        this.connectedUser()
    },
    methods: {
        connectedUser(){
            if(localStorage.groupomaniaUser === undefined) {
                this.approuvedConnexion = false;
                console.log('Utilisateur non connecté !')
            } else {
                this.approuvedConnexion = true;
                console.log('Utilisateur connecté!')
                location.href = "/"
            }
        },
        signup(){
            const nom = this.$refs.nom.value
            const prenom = this.$refs.prenom.value
            const password = this.$refs.password.value
            const email = this.$refs.email.value
            const bio = this.$refs.bio.value
            
            if (email && password){

                notConnectedClient.post('/users/signup', {
                nom,
                prenom,
                email,
                password,
                bio
            }).then((res) => {
                if (res.status === 201){
                    const groupomaniaUser = {
                        token: res.data.token
                    }
                    localStorage.setItem('groupomaniaUser', JSON.stringify(groupomaniaUser))
                    this.$router.push({name: 'Home' })
                }
            })
            .catch((error)=> {
                this.message = error.response.data.error
            })
        }
      }
    }
}

</script>
<style>
.background{
      background-color: #f0f0f0;
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
          margin: 0 auto;
          max-width: 445px;
    }

    form input{
        margin: auto;
        width: 60%;
        font-size: 1rem;
        padding: 18px;
        margin-bottom: 15px;
        text-align: center;
        background-color: white;
        border: 1px rgba(0, 0, 0, 0.548) solid;
        border-radius: 8px;
    }

    .abc {
        display: flex;
        flex-direction: column;
        row-gap: 2em;
    }

    #signup{
        padding: 6px 12px;
        font-size: 1.5rem;
        color: #ffffff;
        background-color: #122441;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #signup:hover{
        transform: scale(1.1);
    }

    #login{
        padding: 6px 12px;
        font-size: 1.5rem;
        color: #ffffff;
        background-color: #fd2d01;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #login:hover{
        transform: scale(1.1);
    }
    
    .message-erreur{
        text-align: center;
        margin: auto;
        color: red;
        font-size: 1rem;
    }

</style>