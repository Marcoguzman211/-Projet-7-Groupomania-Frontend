<template>
<div class='profil'>
    <Header if='approuvedConnexion'/>
    <UserNav if='approuvedConnexion'/>

    <v-card class="mx-auto mt-10" max-width="344">
        <v-list-item>
            <v-list-item-avatar size="70">
                <v-avatar class="mt-3 ml-3 rounded-circle">
                <img src="https://picsum.photos/200" alt="John">
                </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
                <v-card-title>{{userProfil.prenom}} {{userProfil.nom}}</v-card-title>
            </v-list-item-content>
        </v-list-item>
        <v-card-subtitle>{{userProfil.bio}}</v-card-subtitle>
    </v-card>

    <v-card if='approuvedConnexion' class="mx-auto my-10" max-width="344px">
        <v-form @submit.prevent=saveUser() class='mx-auto'>
            <div class="mb-5 mt-8 mx-auto text-h6">Modifiez votre profil</div>
            <input ref="prenom" type="text" placeholder="Prénom" :value="userProfil.prenom">
            <input ref="nom" type="text" placeholder="Nom" :value="userProfil.nom">
            <input ref="bio" type='text' placeholder="Bio" :value="userProfil.bio">
            <div class="mb-5 mt-8 mx-auto text-h6">Modifier votre mot de passe :</div>
            <input ref="password" type="password" placeholder="Mot de passe actuel">
            <input ref="newpassword" type="password" placeholder="Nouveau mot de passe">
            <div class="message-success">{{successMsg}}</div>
            <div class="message-erreur mt-10">{{errorMsg}}</div>
            <div class="mx-auto mb-15 container-button-profil">
                <button id="sauvegarder" class="mx-5 my-10" type="submit">Sauvegarder mon profil </button>
                <button id="supprimer" class="mx-5" type="button" @click="deleteUser()">Effacer mon profil </button>
            </div>
        </v-form>
    </v-card>
</div>
    
</template>
<script>
import {connectedClient} from '../services/auth.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

import Header from '../components/Header.vue';
import UserNav from '../components/UserNav.vue';

export default {
    name: 'Profil',
    components: {
        Header,
        UserNav
    },
    data(){
        return {
            approuvedConnexion: false,
            sessionUserId: 0,
            sessionUserLevel: 0,
            userProfil: [],
            errorMsg: "",
            successMsg: ""
        }
    },
    created(){
        this.connectedUser()
    },
    mounted() {
        if(this.approuvedConnexion) {
            const token = JSON.parse(localStorage.groupomaniaUser).token
            let decodedToken = jwt.verify(token, process.env.VUE_APP_JWT_AUTH_SECRET_TOKEN);
            this.sessionUserId = decodedToken.userId
            this.sessionUserLevel = decodedToken.access_level
            this.getUserProfil()
        }
    },
    methods: {
        connectedUser(){
            if(localStorage.groupomaniaUser === undefined) {
                this.approuvedConnexion = false
                console.error("Vous n'êtes pas connecté !")
                this.$router.push({ name: 'Home' })
            } else {
                this.approuvedConnexion = true
                console.log('Utilisateur connecté !')
            }
        },
        getUserProfil(){
            const userId = this.sessionUserId
            connectedClient.get(`/users/${userId}`)
            .then(res => {
                this.userProfil = res.data
                console.log(this.userProfil)
                this.userProfil.password = ""
                this.userProfil.newPassword = ""
            })
            .catch(error => {
                this.errorMsg = error.response.data.error
            })
        },
        saveUser(){
            const prenom = this.$refs.prenom.value
            const nom = this.$refs.nom.value
            const bio = this.$refs.bio.value
            const password = this.$refs.password.value
            const newpassword = this.$refs.newpassword.value

            connectedClient.put('/users/update', {
                prenom,
                nom,
                bio,
                password,
                newpassword
            })
            .then((res) => {
                if(res.status === 200) {
                    this.errorMsg = ""
                    this.successMsg = res.data.message
                    setTimeout(function(){location.reload()}, 2000)
                }
            })
            .catch((error) => {
                this.errorMsg = error.response.data.error
            })
        },
        deleteUser(){
            if(window.confirm("ATTENTION : La suppression de votre compte est définitive ! Voulez-vous vraiment supprimer votre compte ?")){
                const userId = this.sessionUserId;
                connectedClient.delete(`/users/${userId}`)
                .then((res) => {
                    if(res.status === 200) {
                        this.succesMessage = res.data.message;
                        localStorage.removeItem('groupomaniaUser');
                        setTimeout(function() {location.href = '/';}, 2000)
                    }
                })
                .catch((error) => {
                    this.errorMessage = error.response.data.error;
                    setTimeout(function() {location.reload()}, 2000)
                })
            }
        }
    }
}
</script>
<style>
    form input{
        margin: auto;
        width: 80%;
        font-size: 1.05rem;
        padding: 4px 10px;
        margin-bottom: 15px;
        text-align: center;
        background-color: white;
        border: 1px rgba(0, 0, 0, 0.548) solid;
        border-radius: 15px;
        }
    
    .container-button-profil{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    #sauvegarder{
        padding: 6px 12px;
        font-size: 1.2rem;
        color: white;
        background-color: #122441;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #sauvegarder:hover{
        transform: scale(1.1);
    }

    #supprimer{
        padding: 6px 18px;
        font-size: 1.2rem;
        color: grey;
        /*background-color: #ff6c40;*/
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #supprimer:hover{
        transform: scale(1.1);
    }
    .message-erreur{
      text-align: center;
      margin: auto;
      color: red;
      font-size: 1rem;
      font-weight: bold;
    }

    .message-success{
      text-align: center;
      margin: auto;
      color: rgb(3, 102, 0);
      font-size: 1.2rem;
      font-weight: bold;
    }
</style>