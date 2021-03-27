# forum-app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# Menu
- [Menu](#menu)
- [Vueshool forum-app](#vueschool-forum-app)
- [Database Structure](#database-structure)

# Vueschool forum-app

## Database Structure

<pre>
data = {
  categories: [
    {
      id: 'c1',
      name: 'Chats',
      forums: ['f1']
    }
  ],
  forums: [
    {
      id: 'f1',
      name: 'fishing',
      description: 'Lets talk fishing',
      catetoryId: 'c1',
      threads: ['t1']
    }
  ],
  users: [
    {
      id: 'ur',
      name: 'Alex'
    }
  ],
  threads: [
    {
      id: 't1',
      title: 'What is your favourite food?',
      publishedAt: 1681681861,
      posts: [],
      userId: ''
    }
  ],
  posts: [
    {
      id: 'p1',
      publishedAt: 1681681861,
      userId: 'u1',
      text: 'I like burgers, and you?',
      threadId: 't1'
    }
  ]
}
</pre>
