<template>
    <div>
        <!--Menu dans la version mobile -->
        <v-expansion-panels class="d-sm-none" dark>
            <v-expansion-panel>
                <v-expansion-panel-header class="groupo-bg texte-blanc">Bienvenue chez Groupomania !</v-expansion-panel-header>
                <v-expansion-panel-content class="groupo-bg texte-blanc"> 
                    <router-link to="/" tag="button">Toutes les publications</router-link>
                </v-expansion-panel-content>
                <v-expansion-panel-content class="groupo-bg texte-blanc">
                    <router-link to="/newpublication" tag="button">Nouvelle publication</router-link>
                </v-expansion-panel-content>
                <v-expansion-panel-content class="groupo-bg texte-blanc">
                    <router-link to="/user/profil" tag="button">Profil</router-link>
                </v-expansion-panel-content>
                <v-expansion-panel-content class="groupo-bg texte-blanc">
                    <button @click='deconnexion()'>Déconnexion</button>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <!--Menu principal -->
        <div class="d-none d-sm-flex flex-sm-row justify-sm-space-around groupo-bg texte-blanc">
            <div class="pa-3">
                <router-link to="/" tag="button">Toutes les publications</router-link>
            </div>
            <div class="pa-3">
                <router-link to="/newpublication" tag="button">Nouvelle publication</router-link>
            </div>
            <div class="pa-3">
                <router-link to="/user/profil" tag="button">Profil</router-link>
            </div>
            <div class="pa-3">
                <button @click='deconnexion()'>Déconnexion</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'UserNav',
    methods: {
        deconnexion(){ //On enlève le item dans le localStorage et on recharge la page pour revenir vers le login
            localStorage.removeItem('groupomaniaUser')
            location.href = '/'
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Signika:wght@300;700&display=swap');
div {
    font-family: 'Signika', sans-serif;;
}
    .border {
        border: 2px solid green;
    }
    .groupo-bg{
        background-color: #122441;
    }

    .texte-blanc {
        color: white;
    }

    div.pa-3 {
        transition-duration: .3s;
    }

    div.pa-3:hover {
        transform: scale(1.1);
    }
    .router-link-exact-active{
        font-weight: bold;
    }
</style>