from fastapi import FastAPI,UploadFile,Form,Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from fastapi_login import LoginManager
from typing import Annotated
from pydantic import BaseModel
import sqlite3

con = sqlite3.connect('db.db', check_same_thread=False)
cur = con.cursor()

app = FastAPI()

SECRET = "super-coding"
manager = LoginManager(SECRET, '/login')

@manager.user_loader()
def query_user(id):
    user = cur.execute(f"""
                       SELECT * from users WHERE id='{id}'
                       """).fetchone()
    return user

@app.post('/login')
def signup(id:Annotated[str,Form()],
           password:Annotated[str,Form()]):
    user = query_user(id)
    print(user)
    return '200'

@app.post('/signup')
def signup(id:Annotated[str,Form()],
           password:Annotated[str,Form()],
           name:Annotated[str,Form()],
           email:Annotated[str,Form()]):
    cur.execute(f"""
                INSERT INTO users(id,password,name,email)
                VALUES ('{id}','{password}','{name}','{email}')
                """)
    con.commit()
    return '200'

@app.post('/items')
async def create_item(image:UploadFile,
                title:Annotated[str,Form()], 
                price:Annotated[int,Form()], 
                description:Annotated[str,Form()], 
                place:Annotated[str,Form()],
                insertAT:Annotated[int,Form()]):
    
    image_bytes = await image.read()
    cur.execute(f"""
                INSERT INTO items (title,image,price,description,place,insertAT)
                VALUES ('{title}','{image_bytes.hex()}','{price}','{description}','{place}','{insertAT}')
                """)
    con.commit()
    return '200'

@app.get('/items')
async def get_items():
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    rows = cur.execute(f"""
                       SELECT * from items;
                       """).fetchall()
    return JSONResponse(jsonable_encoder(dict(row) for row in rows))

@app.get('/images/{item_id}')
async def get_image(item_id):
    cur = con.cursor()
    image_bytes = cur.execute(f"""
                              SELECT image from items WHERE id={item_id}
                              """).fetchone()[0]
    return Response(content=bytes.fromhex(image_bytes))

    

app.mount("/",StaticFiles(directory='frontend', html=True), name='frontend')
