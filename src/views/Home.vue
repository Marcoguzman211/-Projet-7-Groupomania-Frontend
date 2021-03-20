<template>
  <div class="home" style="min-height: 100vh;">
    <!-- Si l'utilisateur n'est pas connecté, le composant Login s'affiche-->
    <Login v-if='!approuvedConnexion'/>
    <!-- Si connecté, la page principal contient le header, la barre de navigation et toutes les publications-->
    <Header v-if='approuvedConnexion'/> 
    <UserNav v-if='approuvedConnexion' />
    <Publications v-if='approuvedConnexion' />
  </div>
</template>

<script>
import Login from '../components/Login.vue';
import Header from '../components/Header.vue';
import UserNav from '../components/UserNav.vue';
import Publications from '../components/Publications.vue';

export default {
  name: 'Home',
  components: {
    Login,
    Header,
    UserNav,
    Publications
  },
  data() {
    return{
      approuvedConnexion: false // on déclare une variable false par défault (contiendra la validation comme quoi l'utilisateur est authentifié)
    };
  },
  created(){ // hook de cycle de vie qui vérifie la session utilisateur (Item dans le localStorage)                  
    this.connectedUser()
  },
  methods: { 
    connectedUser(){ // fonction de vérification de la session utilisateur (Item dans le localStorage)
      if(localStorage.groupomaniaUser == undefined){
        this.approuvedConnexion = false;
        console.log('Utilisateur non connecté !');
      } else {
        this.approuvedConnexion = true;
        console.log('Utilisateur connecté !');
      }
    }
  }
}
</script>
<style>
.home {
  background-color: #f0f0f0;
}
</style>
