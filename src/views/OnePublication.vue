<template>
    <div class='OnePublication'>
        <Header v-if='approuvedConnexion' />
        <UserNav v-if='approuvedConnexion' />

        <v-card class="mx-auto mt-8" :key="publication.id" max-width="445">
            <v-img v-if = "publication.image_url !== ''" :src="publication.image_url" alt="Image de la publication" height="200px"></v-img>
            <v-divider horizontal></v-divider>
            <v-card-title>{{publication.titre}}</v-card-title>
            <v-card-subtitle>{{publication.description}}</v-card-subtitle>
            <div class="nom-date px-5 py-3">Publié par {{ publication.prenom }} {{ publication.nom }} | Le {{formatDate(publication.creation_date)}}</div>
            <v-btn v-if="sessionUserId === publication.user_id || sessionUserLevel === 1" @click="deletePublication(publication.id)" class="ma-2" color="red" dark>Effacer
                <v-icon dark right>mdi-cancel</v-icon>
            </v-btn>
        </v-card>
    </div>
</template>
<script>
import { connectedClient } from '../services/auth.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

import Header from '../components/Header.vue';
import UserNav from '../components/UserNav';

export default {
    name: 'OnePublication',
    components: {
        Header,
        UserNav
    },
    data(){
        return {
            approuvedConnexion: false,
            sessionUserId: 0,
            sessionUserLevel: 0,
            publication: [],
            message: ""
        }
    },
    created(){
        this.connectedUser()
    },
    mounted(){
        if(this.approuvedConnexion){
            const token = JSON.parse(localStorage.groupomaniaUser).token
            let decodedToken = jwt.verify(token, process.env.VUE_APP_JWT_AUTH_SECRET_TOKEN);       
            this.sessionUserId = decodedToken.userId                                               
            this.sessionUserLevel = decodedToken.access_level                                      
            this.getOnePublication();
        }
    },
    methods: {
        connectedUser(){
            if(localStorage.groupomaniaUser == undefined){
                this.approuvedConnexion = false
                console.log('Utilisateur non connecté !')
                this.$router.push({ name: 'Home' })
            } else {
                this.approuvedConnexion = true
                console.log('Utilisateur connecté !')
            }
        },
        getOnePublication(){
            const publicationId = this.$route.params.id
            connectedClient.get(`/publications/${publicationId}`)
            .then(res => {
                if(res.data.publication[0] === undefined){
                    this.publication = 0
                } else {
                    this.publication = res.data.publication[0]
                    console.log(this.publication)
                }
            })
        },
        deletePublication(id){                            
            const publicationId = id;
            connectedClient.delete(`/publications/${publicationId}`)
            .then((res) => {
                if(res.status === 200) {
                location.href = '/';
                }
            })
        },
        formatDate(date){
            const event = new Date(date);
            const options ={ year: 'numeric', month:'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}
            return event.toLocaleDateString('fr-FR', options)
        }
    }
}

</script>
<style scoped>
     .background{
      background-size: cover;
      background-attachment: fixed;
      background-position: center;
      min-height: 100vh;
    }

    .nom-date{
        font-size: .6rem;
        color: rgba(0, 0, 0, 0.781);
    }
</style>