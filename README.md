# fsw-challenge-ch7
Binar FSW Challenge Chapter 7

Before using this program:
1. Install all necessary module => `npm install`
2. Set the `config.json` file based on your environtment
3. Migrate the database => `sequelize db:migrate`
4. Seed the datasbe => `sequelize db:seed:all`

Petunjuk Penggunaan:
1. Secara default program dijalankan pada `http://localhost:3000`
2. Pengaturan akun dapat dilakukan pada :
    -> Register Akun => `http://localhost:3000/api/v1/auth/register`
        dengan menyiapkan form dengan method POST berisi :
            * username (string)
            * password (string)
    -> Login Akun => `http://localhost:3000/api/v1/auth/login`
        dengan menyiapkan form dengan method POST berisi: 
            *username (string)
            *password (string)
        jika `username` dan `password` benar, maka akan ditampilkan data `id`,`username`, dan `accessToken`
    -> Login Token => `http://localhost:3000/api/v1/auth/login-token`
        digunakan untuk melakukan cek apakah token tersebut berfungsi
3. Permainan :
    -> Create Room (Authorized Only => maka pastikan telah menginput Token pada header Authorization) => `http://localhost:3000/game/create-room`
        dengan menyiapkan form dengan method POST berisi :
            * room_name (string)
        selanjutnya akan dibuat data pada tabel `Game_room` dan `User_game_history`.
        Kemudian akan ditampilkan data `User_game_history` yang terhubung dengan data `Game_room` yang telah dibuat
        **Note: `room_name` bersifat unique
    -> Join Room (Authorized Only) => `http://localhost:3000/game/join-room`
        dengan menyiapkanform dengan method POST berisi :
            * room_name (string)
        selanjutnya akan ditambahkan pemain ke dalam room tersebut.
        **Note: pemain tidak bisa lebih dari 2
    -> Fight Room (Authorized Only and Participant Only) => `http://localhost:3000/game/fight/:room_id`
        dengan menyiapkan form dengan method POST berisi :
            * pick (string)
        selanjutnya akan diubah data `player_1_pick` atau `player_2_pick` yang ada pada tabel `User_game_history`.
        Permainan berlangsung sebanyak 3 ronde, setelah itu akan ditampilkan hasil perolehan skor dan pemenang di `Game_room` tersebut.
        **Note: input terbatas pada 'R' (rock), 'P' (paper), 'S' (scissor)

