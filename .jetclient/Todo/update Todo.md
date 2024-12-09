```toml
name = 'update Todo'
method = 'PUT'
url = 'http://localhost:3001/updatetodo/1'
sortWeight = 3000000
id = '80eaee90-e5f5-46a3-970c-8975bffba0a7'

[body]
type = 'JSON'
raw = '''
{
  "id": 1,
  "name": "Buy Groceries and Snacks",
  "description": "Buy fruits, vegetables, and some snacks from the store.",
  "completed": true
}
'''
```
