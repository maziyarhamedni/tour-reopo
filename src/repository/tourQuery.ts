import Repository from './repository';
import { Tour } from './../utils/express';
import { StartLocation, Location } from './../utils/express';

class TourQuery extends Repository{
 
  constructor() {
    super()
    
  }

  
  createTour = async (data: Tour) => {
   
    const newTour = await this.tour.create({
      data: {
        name: data.name,
        duration: data.duration,
        maxGroupSize: data.maxGroupSize,
        difficulty: data.difficulty,
        ratingsAverage: data.ratingsAverage,
        ratingsQuantity: data.ratingsQuantity,
        price: data.price,
        priceDiscount: data.priceDiscount,
        summary: data.summary,
        description: data.description,
        imageCover: data.imageCover,
        images: data.images,
        createdAt: new Date(),
        startDates: data.startDates,
      },
    });
    return newTour;
  };

  createStartLocation = async (data: StartLocation) => {
   
    const newStartLoc = await this.tour.update({
      where: { id: data.tourId }, 
      data: {
        startLocation: {
          connectOrCreate: {
            where: {
              
              tourId: data.tourId,
            },
            create: {
             
              description: data.description,
              type: data.type,
              coordinates: { set: data.coordinates },
              address: data.address,
            },
          },
        },
      },
    });

    return newStartLoc;
  };

  createLocation = async (data: Location) => {
    const newLocation = await this.tour.update({
      where: { id: data.tourId },
      data: {
        locations: {
          create: {
            day: data.day,
            description: data.description,
            address: data.address,
            coordinates: { set: data.coordinates },
            type: data.type,
          },
        },
      },
    });
    return newLocation;
  };

  findTourById = async (id: string) => {
    const tour = await this.tour.findUnique({
      where: {
        id: id,
      },
      include: {
        startLocation: true,
        locations: {
          omit: {
            tourId: true,
          },
        },
        guides: {
          select: {
            id: true,
            name: true,
            lastName: true,
            role: true,
            photo:true
          },
        },
      },
    });

    return tour;
  };
  findTourByName = async(name:string)=>{
    const tour = await this.tour.findUnique({
      where:{
        name:name
      },
      include:{
        startLocation:true,
        guides:true,
        locations:true,
        reviews:{
          
          include:{
            user:{
              omit:{
                password:true,
                passwordChengeAt:true,
              }
            }
            
          }
        }
      }
    })
   
    return tour;
  }

  getAllTour = async () => {
    const tours = await this.tour.findMany({
      include:{
        startLocation:true,
        guides:true,
        locations:true
        
      }
    });
    return tours;
  };

  updateTour = async (id: string, data: {}) => {
    await this.tour.update({
      where: { id: id },
      data,
    });
    const updateTour = await this.findTourById(id)
    return updateTour
  };

  deleteTour = async (id: string) => {
    await this.tour.delete({
      where: {
        id: id,
      },
    });
  };

  addTourGuide = async (tourId: string, userIds: string[]) => {
    const guide = await this.tour.update({
      where: {
        id: tourId,
      },
      data: {
        guides: {
          connect: userIds.map((userId) => ({ id: userId })),
        },
      },
    });

    return guide;
  };
   
  // tourWhiten = async (radius: any, lat: any, lng: any) => {
    // const toursWithinRadiuds = await this.repository.startLocation.findMany({  
    //   where: {  
    //     // Using a raw filtering condition for geospatial query  
    //     AND: [  
          
    //       {  
    //         // Use ST_DWithin to find locations within the radius  
    //         coordinates: {  
    //           has :area.prisma.$executeRaw`ST_DWithin(  
    //             ST_MakePoint(${lng}, ${lat})::geography,  
    //             ST_MakePoint(coordinates[0], coordinates[1])::geography,  
    //             ${radius * 1000} 
    //           )`  
    //         }  
    //       }  
    //     ]  
    //   },  
    //   include: {  
    //     tour: true, // Include associated tour data  
    //   },  
    // });  

  //   const toursWithinRadius = await this.prisma.$queryRaw`  
  //   SELECT sl.*, t.*  
  //   FROM "StartLocation" sl  
  //   JOIN "Tour" t ON sl."tourId" = t.id  
  //   WHERE ST_DWithin(  
  //     ST_MakePoint(${lng}, ${lat})::geography,  
  //     ST_MakePoint(sl."coordinates"[0], sl."coordinates"[1])::geography,  
  //     ${radius * 1000} 
  //   );  
  // `;  

  //   return toursWithinRadius;
  // };
}

export = TourQuery;
