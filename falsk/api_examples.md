# API Examples

## Create User
**POST `/api/users`**
```json
{
    "username": "johndoe",
    "email": "john@example.com"
}
```

Response:
```json
{
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
}
```

## Create Recipe
**POST `/api/recipes`**
```json
{
    "title": "Spaghetti Carbonara",
    "instructions": "1. Cook pasta\n2. Fry bacon\n3. Mix eggs and cheese\n4. Combine all ingredients",
    "user_id": 1,
    "ingredients": [
        {
            "name": "Spaghetti",
            "quantity": "500g"
        },
        {
            "name": "Eggs",
            "quantity": "3 large"
        },
        {
            "name": "Pecorino Romano",
            "quantity": "100g"
        },
        {
            "name": "Bacon",
            "quantity": "200g"
        }
    ]
}
```

Response:
```json
{
    "id": 1,
    "title": "Spaghetti Carbonara",
    "instructions": "1. Cook pasta\n2. Fry bacon\n3. Mix eggs and cheese\n4. Combine all ingredients",
    "created_at": "2025-06-14T10:30:00Z",
    "user_id": 1,
    "ingredients": [
        {
            "id": 1,
            "name": "Spaghetti",
            "quantity": "500g",
            "recipe_id": 1
        },
        {
            "id": 2,
            "name": "Eggs",
            "quantity": "3 large",
            "recipe_id": 1
        },
        {
            "id": 3,
            "name": "Pecorino Romano",
            "quantity": "100g",
            "recipe_id": 1
        },
        {
            "id": 4,
            "name": "Bacon",
            "quantity": "200g",
            "recipe_id": 1
        }
    ]
}
```

## Get All Recipes
**GET `/api/recipes`**

Response:
```json
[
    {
        "id": 1,
        "title": "Spaghetti Carbonara",
        "instructions": "1. Cook pasta\n2. Fry bacon\n3. Mix eggs and cheese\n4. Combine all ingredients",
        "created_at": "2025-06-14T10:30:00Z",
        "user_id": 1,
        "ingredients": [
            {
                "id": 1,
                "name": "Spaghetti",
                "quantity": "500g",
                "recipe_id": 1
            },
            {
                "id": 2,
                "name": "Eggs",
                "quantity": "3 large",
                "recipe_id": 1
            }
        ]
    }
]
```

## Get Single Recipe
**GET `/api/recipes/1`**

Response:
```json
{
    "id": 1,
    "title": "Spaghetti Carbonara",
    "instructions": "1. Cook pasta\n2. Fry bacon\n3. Mix eggs and cheese\n4. Combine all ingredients",
    "created_at": "2025-06-14T10:30:00Z",
    "user_id": 1,
    "ingredients": [
        {
            "id": 1,
            "name": "Spaghetti",
            "quantity": "500g",
            "recipe_id": 1
        },
        {
            "id": 2,
            "name": "Eggs",
            "quantity": "3 large",
            "recipe_id": 1
        }
    ]
}
```

## Update Recipe
**PUT `/api/recipes/1`**
```json
{
    "title": "Updated Spaghetti Carbonara",
    "instructions": "1. Cook pasta al dente\n2. Crisp the bacon\n3. Mix fresh eggs and cheese\n4. Combine all ingredients carefully",
    "ingredients": [
        {
            "name": "Spaghetti",
            "quantity": "400g"
        },
        {
            "name": "Fresh Eggs",
            "quantity": "4 large"
        },
        {
            "name": "Pecorino Romano",
            "quantity": "150g"
        }
    ]
}
```

Response:
```json
{
    "id": 1,
    "title": "Updated Spaghetti Carbonara",
    "instructions": "1. Cook pasta al dente\n2. Crisp the bacon\n3. Mix fresh eggs and cheese\n4. Combine all ingredients carefully",
    "created_at": "2025-06-14T10:30:00Z",
    "user_id": 1,
    "ingredients": [
        {
            "id": 5,
            "name": "Spaghetti",
            "quantity": "400g",
            "recipe_id": 1
        },
        {
            "id": 6,
            "name": "Fresh Eggs",
            "quantity": "4 large",
            "recipe_id": 1
        },
        {
            "id": 7,
            "name": "Pecorino Romano",
            "quantity": "150g",
            "recipe_id": 1
        }
    ]
}
```

## Delete Recipe
**DELETE `/api/recipes/1`**

Response: Empty response with status code 204
