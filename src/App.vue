<template>
    <div class="view login" v-if="state.username === '' || state.username === null">
      <form class="login-form" @submit.prevent="Login">
        <div class="form-inner">
          <h1> Login to Chat</h1>
          <label for="username">Username</label>
          <input 
            type="text" 
            v-model ="inputUsername" 
            placeholder="Please enter your username ... " 
            />
          <input 
            type="submit" 
            value="Log in" 
            />
        </div> 
      </form>    
    </div>
    <div class="view chat" v-else>
      <header>
        <button class="logout" @click="Logout">Logout</button>
        <h1>Welcome, {{ state.username }}</h1>
      </header>

      <section class="chat-box">
        <div v-for="message in state.messages" 
             v-bind:key="message.key" 
             v-bind:class="(message.username == state.username ? 'message current-user' : 'message')">
          <div class="message-inner">
            <div class="username">{{ message.username }}</div>
            <div class="content">{{ message.content }}</div>
          </div>
        </div>
      </section>

      <footer>
        <form @submit.prevent="SendMessage">
          <input type="text" v-model="inputMessage" placeholder="Write a message..." />
          <input type="submit" value="Send" />
        </form>
      </footer>
    </div>
</template>

<script>
import {reactive, onMounted, ref} from 'vue';
import db from "./db";

export default {
 setup () {
   // Log-in
  const inputUsername = ref("");
  const inputMessage = ref("");
  const state = reactive ({
    username:"",
    messages: []
  });

  const Login = () => {
    // check if username to login is not empty or blank
    if (inputUsername.value != "" || inputUsername.value != null){
      state.username = inputUsername.value;
      
      //clear the input field
      inputUsername.value ="";
    }
  }
  //logout
  const Logout = () => {
    state.username="";
  }

  const SendMessage = () => {
    // db reference, get the messages from the db
    const messagesRef = db.database().ref("messages");
    
    // check if the message is not fill
    if (inputMessage.value === "" || inputMessage.value === null){
      return;
    }

    //record new message
    const message = {
      username: state.username,
      content: inputMessage.value
    }

    //put data back to db
    messagesRef.push(message);

    // clear input 
    inputMessage.value="";
  }

  //display message
  onMounted(() => {

    const messagesRef = db.database().ref("messages");

    // check if there is any changement and send back data
    messagesRef.on('value', snapshot => {
      const data = snapshot.val();
      let messages =[];

      //loop through db array
      Object.keys(data).forEach(key => {
        messages.push({
          id: key,
          username: data[key].username,
          content: data[key].content
        });
      });
      // update state
      state.messages = messages;
    }) ;
  })
   return {
     inputUsername,
     inputMessage,
     Login,
     Logout,
     state,
     SendMessage
   }
 }
}
</script>


<style lang="scss">
* {
	font-family: 'Raleway', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.view {
	display: flex;
	justify-content: center;
	min-height: 100vh;
	background-color: #091C29; 
	
	&.login {
		align-items: center;
		.login-form {
			display: block;
			width: 100%;
			padding: 15px;
			
			.form-inner {
				display: block;
				background-color: #FFF;
				padding: 50px 15px;
				border-radius: 16px;
				box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
				h1 {
					color: #AAA;
					font-size: 28px;
					margin-bottom: 30px;
				}
				label {
					display: block;
					margin-bottom: 5px;
					color: #AAA;
					font-size: 16px;
					transition: 0.4s;
				}
				input[type="text"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
					border-radius: 10px;
					margin-bottom: 15px;
					
					color: #333;
					font-size: 18px;
					box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
					background-color: #F3F3F3;
					transition: 0.4s;
					&::placeholder {
						color: #888;
						transition: 0.4s;
					}
				}
				input[type="submit"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
					background-color: #01c0f2;
					border-radius: 10px;
					color: #FFF;
					font-size: 18px;
					font-weight: 700;
				}
				&:focus-within {
					label {
						color: #01c0f2;
					}
					input[type="text"] {
						background-color: #FFF;
						box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
						&::placeholder {
							color: #666;
						}
					}
				}
			}
		}
	}
	&.chat {
		flex-direction: column;
		header {
			position: relative;
			display: block;
			width: 100%;
			padding: 50px 30px 10px;
			.logout {
				position: absolute;
				top: 15px;
				right: 15px;
				appearance: none;
				border: none;
				outline: none;
				background: #01c0f2;
				padding: 8px 10px;
				border-radius: 8px;
				color: #FFF;
				font-size: 18px;
				margin-bottom: 10px;
				text-align: right;
			}
			h1 {
				color: #FFF;
			}
		}
		.chat-box {
			border-radius: 24px 24px 0px 0px;
			background-color: #FFF;
			box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
			flex: 1 1 100%;
			padding: 30px;
			.message {
				display: flex;
				margin-bottom: 15px;
				
				.message-inner {
					.username {
						color: #888;
						font-size: 16px;
						margin-bottom: 5px;
						padding-left: 15px;
						padding-right: 15px;
					}
					.content {
						display: inline-block;
						padding: 10px 20px;
						background-color: #F3F3F3;
						border-radius: 999px;
						color: #333;
						font-size: 18px;
						line-height: 1.2em;
						text-align: left;
					}
				}
				&.current-user {
					margin-top: 30px;
					justify-content: flex-end;
					text-align: right;
					.message-inner {
						max-width: 75%;
						.content {
							color: #FFF;
							font-weight: 600;
							background-color: #01c0f2;
						}
					}
				}
			}
		}
		footer {
			position: sticky;
			bottom: 0px;
			background-color: #FFF;
			padding: 30px;
			box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
			form {
				display: flex;
				input[type="text"] {
					flex: 1 1 100%;
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
					border-radius: 10px 0px 0px 10px;
					
					color: #333;
					font-size: 18px;
					box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
					background-color: #F3F3F3;
					transition: 0.4s;
					&::placeholder {
						color: #888;
						transition: 0.4s;
					}
				}
				
				input[type="submit"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					padding: 10px 15px;
					border-radius: 0px 10px 10px 0px;
					background-color: #01c0f2;
					color: #FFF;
					font-size: 18px;
					font-weight: 700;
				}
			}
		}
	}
}
</style>
