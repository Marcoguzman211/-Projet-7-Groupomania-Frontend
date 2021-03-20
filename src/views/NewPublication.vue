<template>
    <div class="NewPublication background">
       <!--Header pour afficher le logo --> 
        <Header v-if="approuvedConnexion"/>
        <UserNav v-if='approuvedConnexion'/>

        <v-card if='approuvedConnexion' class="mx-auto my-10" elevation="6" max-width="344px" @submit.prevent="newPublication()">
            <form class='mx-auto'>
                <div class="mb-5 mt-8 mx-auto text-h6">Que voulez-vous dire ?</div>
                <label for="publinputform" class='text-subtitle-2 mr-auto pl-6'>Titre</label>
                <input id="publinputform" class='publinput' ref="titre" type="text" placeholder="Ajoutez un titre">
                <label for="descriptionnew" class='text-subtitle-2 mr-auto pl-6 mt-2'>Contenu</label>
                <v-container fluid>
                    <v-row>
                        <v-col cols='12' md="12" class="justify-center">
                            <textarea ref='description' name="description" id="descriptionnew" cols="36" rows="5" class="descriptionnew" placeholder="Que voulez-vous dire ? ..."></textarea>
                        </v-col>
                    </v-row>
                </v-container>
                <label for='uploadImage' class="mb-1 mt-2 mx-auto text-h6">Ajoutez une image :</label>
                <input ref="uploadImage" type="file" class="mt-2 mb-6 publinput" accept="image/jpg,image/jpeg,image/png" id="uploadImage" title="Renseignez une image pour votre publication"/>
                <div class="message-erreur">{{message}}</div>
                <button id="publier" class="mx-5 mt-0 mb-10" type="submit">Publier </button>
            </form>
        </v-card>
    </div>
</template>
<script>
import {connectedClient} from '../services/auth.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

import Header from '../components/Header.vue';
import UserNav from '../components/UserNav.vue';

export default {
    name: "NewPublication",
    components: {
        Header,
        UserNav
    },
    data(){
        return {
            approuvedConnexion: false,
            sessionUserId: 0,
            sessionUserLevel: 0,
            message: ""
        }
    },
    created(){
        this.connectedUser()
    },
    mounted(){
        if(this.approuvedConnexion){ //Fonction pour décoder le token dans le localStorage et récupérer le id et access_level
            const token = JSON.parse(localStorage.groupomaniaUser).token
            let decodedToken = jwt.verify(token, process.env.VUE_APP_JWT_AUTH_SECRET_TOKEN)
            this.sessionUserId = decodedToken.userId
            this.sessionUserLevel = decodedToken.access_level
        }
    },
    methods: {
        connectedUser(){ // fonction de vérification de la session utilisateur (Item dans le localStorage)
            if(localStorage.groupomaniaUser == undefined){
                this.approuvedConnexion = false
                console.log('Utilisateur non connecté !')
                this.$router.push({ name:'Home'})
            } else {
                this.approuvedConnexion = true
                console.log('Utilisateur connecté !')
            }
        },
        newPublication(){
            const userId = this.sessionUserId
            const titre = this.$refs.titre.value
            const description = this.$refs.description.value
            const uploadImage = this.$refs.uploadImage.files[0]

            const fileName = this.$refs.uploadImage.value;
            const lastDot = fileName.lastIndexOf(".") + 1;
            const extensionFile = fileName.substring(lastDot, fileName.length).toLowerCase();

            if(!titre){
                this.message = "Veuillez insérer un titre"
            } else {
                if(extensionFile =='jpg' || extensionFile == 'jpeg' || extensionFile=='png' || uploadImage==undefined){
                    let formData = new FormData()
                    formData.append('userId', userId)
                    formData.append('titre', titre)
                    formData.append('description', description),
                    formData.append('image', uploadImage)

                    connectedClient.post('/publications', formData)
                    .then((res) => {
                        if(res.status === 201){
                            this.$router.push({ name:'Home'})
                        }
                    })
                    .catch(error => {
                        this.message = error.response.data.error
                    })
                } else {
                    this.message = "Seules les images de type JPG/JPEG/PNG sont autorisées !"
                }
            }
        }
    }
}
</script>
<style scoped>
    #uploadImage {
        position: relative;
  width: 88%;
  background: white;
  border-radius: 0% 0% 0% 0% / 0% 0% 0% 0% ;
  color: #122441;
  padding: .5em;
  box-shadow: 5px 5px rgba(0,0,0,.15);
  transition: all .4s ease;
    }
    #descriptionnew {
        padding-left: .3em;
        padding-top: .3em;
    }
    .publinput {
        margin: 0 1.3em;
        border-radius: 0;
        width: 89.5%;
    }
    .texte-haut {
        min-height: 100px;
    }
    .background{
        background-size: cover;
        background-attachment: fixed;
        background-position: center;
        min-height: 100%;
        } 
    .message-erreur{
        text-align: center;
        margin: auto;
        color: red;
        font-size: 1rem;
        margin-bottom: 3em;
        }
    .descriptionnew{
        margin: 0 .6em;
        border: 2px solid grey;
        width: 96%;
    }

    .publier-btn{
        padding: 6px 12px;
        font-size: 1.5rem;
        color: #ffffff;
        background-color: #122441;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        }

    .publier-btn:hover{
        transform: scale(1.1);
    }

    #publier {
        padding: 6px 12px;
        font-size: 1.2rem;
        color: white;
        background-color: #122441;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        align-self: center;
    }

    #publier:hover{
        transform: scale(1.1);
    }
</style>