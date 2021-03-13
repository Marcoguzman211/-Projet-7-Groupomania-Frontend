<template>
    <div>
        <v-expansion-panels popout>
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
    </div>
</template>
<script>
export default {
    name: 'UserNav',
    methods: {
        deconnexion(){
            localStorage.removeItem('groupomaniaUser')
            location.href = '/'
        }
    }
}
</script>

<style scoped>
    .border {
        border: 2px solid green;
    }
    .groupo-bg{
        background-color: #122441;
    }

    .texte-blanc {
        color: white;
    }

    .router-link-exact-active{
        font-weight: bold;
    }
</style>