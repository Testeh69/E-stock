import qrcode
import json

# Données à encoder
data = 'QZAERZ5, 45'


json_data = json.dumps(data)


# Créer un objet QR Code
qr = qrcode.QRCode(
    version=1,  # Contrôle la taille du QR code (1 = plus petit, 40 = plus grand)
    error_correction=qrcode.constants.ERROR_CORRECT_L,  # Niveau de correction d'erreur
    box_size=10,  # Taille de chaque boîte du QR code
    border=4,  # Largeur des bordures (minimum = 4)
)

# Ajouter les données
qr.add_data(json_data)
qr.make(fit=True)

# Générer l'image du QR code
img = qr.make_image(fill_color="black", back_color="white")

# Sauvegarder l'image
img.save("json_qr_code_2.png")