

interface IBookingData{
    customerAuthId: string,
    workerAuthId: string,
    service: string[],
    bookingDate: string,
    bookingTime: string,
    customerAddress: string,
    customerPhoneNumber: string,
    workerPhoneNumber: string,
    problemDescription: string,
    price: number,
    

}

export const createBookingService = async(data: IBookingData) =>{
    const {customerAuthId,workerAuthId,service,bookingDate,bookingTime,customerAddress,customerPhoneNumber,price,problemDescription,workerPhoneNumber} =data;

    
}