<template>
    <div class="NewPublication">
    <Header v-if="approuvedConnexion"/>
    <UserNav v-if='approuvedConnexion'/>

    <v-card if='approuvedConnexion' class="mx-auto my-10" max-width="344px" @submit.prevent="newPublication()">
        <v-form class='mx-auto'>
            <div class="mb-5 mt-8 mx-auto text-h6">Partagez</div>
            <input ref="titre" type="text" placeholder="Titre">
            <input ref="description" type="text" placeholder="Description">
            <div class="mb-5 mt-8 mx-auto text-h6">Ajoutez une image :</div>
            <input ref="uploadImage" type="file" class="mt-5" accept="image/jpg,image/jpeg,image/png" id="uploadImage" title="Renseignez une image pour votre publication"/>
            <div class="message-erreur">{{message}}</div>
            <v-btn type='submit' elevation="0" class='mx-auto mb-5'>Publier</v-btn>
        </v-form>
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
        if(this.approuvedConnexion){
            const token = JSON.parse(localStorage.groupomaniaUser).token
            let decodedToken = jwt.verify(token, process.env.VUE_APP_JWT_AUTH_SECRET_TOKEN)
            this.sessionUserId = decodedToken.userId
            this.sessionUserLevel = decodedToken.access_level
        }
    },
    methods: {
        connectedUser(){
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
</script>
<style scoped>
.message-erreur{
        text-align: center;
        margin: auto;
        color: red;
        font-size: 1rem;
    }
</style>