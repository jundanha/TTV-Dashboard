<!-- src/components/LandingPage.vue -->
<template>
  <div class="landing-page">
    <header>
      <nav>
        <div class="logo">MyApp</div>
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <section class="hero">
        <h1>Welcome to MyApp</h1>
        <p>Your solution for awesome things</p>
        <button @click="signUp">Sign Up</button>
      </section>
      <section id="features">
        <h2>Features</h2>
        <p>Feature 1: Amazing speed</p>
        <p>Feature 2: Incredible reliability</p>
        <p>Feature 3: User-friendly interface</p>
      </section>
      <section id="about">
        <h2>About Us</h2>
        <p>We are committed to providing the best service.</p>
      </section>
      <section id="contact">
        <h2>Contact Us</h2>
        <form @submit.prevent="submitForm">
          <input type="text" v-model="name" placeholder="Your Name" required>
          <input type="email" v-model="email" placeholder="Your Email" required>
          <textarea v-model="message" placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>
    </main>
    <footer>
      <p>&copy; 2024 MyApp. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      message: ''
    };
  },
  methods: {
    signUp() {
      alert('Sign-up form coming soon!');
    },
    submitForm() {
      alert(`Message sent by ${this.name}`);
      this.name = '';
      this.email = '';
      this.message = '';
    }
  }
};
</script>

<style scoped>
.landing-page {
  font-family: Arial, sans-serif;
}

header {
  background: #333;
  color: white;
  padding: 1rem 0;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

nav ul li a {
  color: white;
  text-decoration: none;
}

.hero {
  text-align: center;
  padding: 5rem 1rem;
  background: #f7f7f7;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.hero button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: white;
  background: #333;
  border: none;
  cursor: pointer;
}

section {
  padding: 3rem 1rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

form input,
form textarea {
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

form button {
  padding: 0.5rem;
  font-size: 1rem;
  color: white;
  background: #333;
  border: none;
  cursor: pointer;
}

footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 1rem 0;
}
</style>
