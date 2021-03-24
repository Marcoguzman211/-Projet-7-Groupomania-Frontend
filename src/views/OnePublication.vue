<template>
    <div class='OnePublication background'>
        <Header v-if='approuvedConnexion' />
        <UserNav v-if='approuvedConnexion' />

        <v-card class="mx-auto mt-8" :key="publication.id" max-width="445">
            <v-img v-if = "publication.image_url !== ''" :src="publication.image_url" alt="Image de la publication" max-height="600px"></v-img>
            <v-divider horizontal></v-divider>
            <v-card-title class="my-4 text-h5">{{publication.titre}}</v-card-title>
            <v-card-subtitle class="mx-auto text-body-1">{{publication.description}}</v-card-subtitle>
            <div class="nom-date px-5 py-3">Publié par {{ publication.prenom }} {{ publication.nom }} | Le {{ formatDate(publication.creation_date) }}</div>
            <!-- v-if pour autoriser le propiétaire du post ou le modérateur pour l'effacer -->
            <button v-if="sessionUserId === publication.user_id || sessionUserLevel === 1" @click="deletePublication(publication.id)" id="effacer" class="mx-5 my-10" type="button">EFFACER </button>
            <div class="messagestyle">{{message}}</div>
        </v-card>
        <v-card class="mx-auto mt-3 comment" v-for = "commentaire in commentaires" :key="commentaire.id" width="445">
          <v-list-item five-line class="px-0 py-0">
              <v-list-item-content class="px-0 py-0">
                  <button v-if="sessionUserId === commentaire.user_id || sessionUserLevel === 1" @click="deleteComment(commentaire.id)" class="supprimer">Supprimer le commentaire</button>
                  <v-divider v-if="sessionUserId === commentaire.user_id || sessionUserLevel === 1" horizontal></v-divider>
                  <div class="nom-date px-5 py-1">Commenté par {{commentaire.prenom}} {{commentaire.nom}} | Le {{formatDate(commentaire.creation_date)}}</div>
                  <v-divider horizontal></v-divider>
                      <div class="description px-5 py-3">{{commentaire.message}}</div>
                </v-list-item-content>
            </v-list-item>
        </v-card>
        <v-card v-if="publication !== 0" class="mx-auto mt-8 mb-10" max-width="445">
          <v-list-item five-line class="px-0 py-0">
              <v-list-item-content class="px-0 py-0">
                  <div class="nom-date px-3 py-1">Nouveau commentaire :</div>
                  <v-divider horizontal></v-divider>
                  <form class="poster" @submit.prevent = createComment()>
                      <textarea id="commentaire" ref="commentaire" name="commentaire" placeholder="Ecrivez votre commentaire..." required></textarea>
                      <button id="poster" type="submit" class="mx-5">Poster</button>
                  </form>
                  <div class="message-erreur">{{ message }}</div>
              </v-list-item-content>
          </v-list-item>
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
            commentaires: [],
            message: ""
        }
    },
    created(){
        this.connectedUser()
    },
    mounted(){
        if(this.approuvedConnexion){ //Fonction pour décoder le token dans le localStorage et récupérer le id et access_level
            const token = JSON.parse(localStorage.groupomaniaUser).token
            let decodedToken = jwt.verify(token, process.env.VUE_APP_JWT_AUTH_SECRET_TOKEN);       
            this.sessionUserId = decodedToken.userId                                               
            this.sessionUserLevel = decodedToken.access_level                                      
            this.getOnePublication();
        }
    },
    methods: {
        connectedUser(){ // fonction de vérification de la session utilisateur (Item dans le localStorage)
            if(localStorage.groupomaniaUser == undefined){
                this.approuvedConnexion = false
                console.log('Utilisateur non connecté !')
                this.$router.push({ name: 'Home' })
            } else {
                this.approuvedConnexion = true
                console.log('Utilisateur connecté !')
            }
        },
        getOnePublication(){ //Requête pour récupérer la publication basée sur les paramêtres de l'url
            const publicationId = this.$route.params.id
            connectedClient.get(`/publications/${publicationId}`)
            .then(res => {
                if(res.data.publication[0] === undefined){
                    this.publication = 0
                } else {
                    //On rempli la variable publication avec la réponse
                    this.publication = res.data.publication[0]
                    this.commentaires = res.data.commentaires
                    console.log(this.commentaires)
                }
            })
        },
        createComment(){
            const userId = this.sessionUserId
            const publicationId = this.publication.id
            const message = this.$refs.commentaire.value

            connectedClient.post('/publications/commentaire', {
                userId,
                publicationId,
                message
            })
            .then((res) => {
                if(res.status === 201) {
                    location.reload()
                }
            })
            .catch((error) => {
                this.message = error.response.data.error
            })
        },
        deleteComment(id){
            const commentaireId = id
            connectedClient.delete(`/publications/commentaire/${commentaireId}`)
            .then((res) => {
                if(res.status === 200) {
                    location.reload()
                }
            })
        },
        deletePublication(id){ //Fonction pour effacer une publication                  
            const publicationId = id;
            if(window.confirm("ATTENTION : La suppression de la publication est définitive ! Voulez-vous continuer ?")){
                //Si validé, on passe la requête vers l'API pour effacer la publication
                connectedClient.delete(`/publications/${publicationId}`)
                .then((res) => {
                    if(res.status === 200) {
                    this.message = res.data.message
                    setTimeout(()=> { location.href = '/'}, 2000)          
                    }
                })
            }
        },
        formatDate(date){ //Fonction pour convertir le timestamp de la base de données au format français
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
      min-height: 100%;
    }

    .nom-date{
        font-size: .8rem;
        color: rgba(0, 0, 0, 0.781);
    }

    .messagestyle {
      text-align: center;
      margin: auto;
      color: #122441; 
      font-size: 1.2rem;
      font-weight: bold;
      padding-bottom: 2rem;
    }

    #effacer {
        padding: 6px 12px;
        font-size: 1rem;
        color: white;
        background-color: #d1515a;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #effacer:hover{
        transform: scale(1.1);
    }

    form.poster{
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
    }

     form textarea{
        margin: auto;
        width: 80%;
        height: 100px;
        font-size: 1.05rem;
        padding: 10px;
        background-color: white;
        border: 1px rgba(0, 0, 0, 0.548) solid;
        border-radius: 5px;
    }

    #poster{
        padding: 6px 12px;
        font-size: 1.5rem;
        color: white;
        background-color: #122441;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
    }

    #poster:hover{
        transform: scale(1.1);
    }

    .newcomment{
        background-color: rgb(255, 255, 255);
    }

    .supprimer{
        padding: 6px 12px;
        margin-left: auto;
        font-size: 1rem;
        color:#d1515a;
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        font-weight: bold;
    }

    .supprimer:hover{
        transform: scale(1.1);
    }
 </style>