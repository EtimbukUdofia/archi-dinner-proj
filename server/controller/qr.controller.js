import { QrCode } from "../model/QrCode.js";


export const getQrCode = async (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({ success: false, message: 'Reference is required' });
  }

  try {
    // const qrCode =
    //   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKuSURBVO3BQW7sWAwEwSxC979yjpdcPUCQur/NYUT8wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw8l4ZtUuiTcodIloVPpkvBNKk8Ua5RijVKsUS5epvKmJJyodEm4Q+UOlTcl4U3FGqVYoxRrlIsPS8IdKp+UhE7liSTcofJJxRqlWKMUa5SLPy4JnUqXhJMkdCp/WbFGKdYoxRrlYpgkdConSZikWKMUa5RijXLxYSr/UhJOVJ5Q+U2KNUqxRinWKBcvS8K/pNIloVPpktCpnCThNyvWKMUapVijxB/8YUl4k8pfVqxRijVKsUa5eCgJncodSehUuiTcoXKShE6lS8KbVE6S0Kk8UaxRijVKsUa5+LIknCShUzlJwh0qXRJOVLoknKh0SehUPqlYoxRrlGKNEn/woiR8kkqXhBOVLgmdSpeETuUkCU+ovKlYoxRrlGKNcvEylS4JncpJEjqVE5UuCXck4QmVLgmdSpeETyrWKMUapVijXLwsCZ1Kl4Q7kvCbJKFT6VTuSEKn8kSxRinWKMUaJf7gD0tCp9Il4UTlJAlPqJwkoVN5olijFGuUYo1y8VASvknlDpUuCSdJOFHpktCpnCShU3lTsUYp1ijFGuXiZSpvSsKJyptU7lD5TYo1SrFGKdYoFx+WhDtU7khCp3Ki8kQSOpUuCZ1Kp/JJxRqlWKMUa5SLP06lS8IdKidJOElCp9Il4Q6VJ4o1SrFGKdYoF/8zKidJ6FROktAloVP5pmKNUqxRijXKxYepfJPKHUnoVO5Q+U2KNUqxRinWKBcvS8I3JaFT6ZLwpiR0Kk8koVN5olijFGuUYo0Sf7DGKNYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1yn+R9QT34dN3kgAAAABJRU5ErkJggg==";

    const record = await QrCode.findOne({ reference });
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    };
    
    res.status(200).json({ success: true, email: record.email, qrcode: record.qrCodeDataUrl, firstName: record.firstName, lastName: record.lastName, department: record.department });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Error getting QR Code' });
  }
};