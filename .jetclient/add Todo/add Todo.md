```toml
name = 'add Todo'
method = 'POST'
url = 'http://localhost:8000/todos'
sortWeight = 1000000
id = '126fb6f7-7ba8-4909-bcf5-b1f498d9c8d9'

[body]
type = 'JSON'
raw = '''
{
  "name": "Buy groceries",
  "description": "Milk and fruit",
  "completed": false
}

'''
```
