import qrcode

img = qrcode.make("BIN-001")
img.save("bin001.png")

print("QR Code Generated Successfully")