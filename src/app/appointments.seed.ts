import { InMemoryDbService } from 'angular-in-memory-web-api';

import * as moment from 'moment';


export class AppointmentsSeed implements InMemoryDbService {
  createDb() {
    const appointments = [
      { id: 1, date: '2017-12-14', title: 'Gama Academy' },
      { id: 2, date: '2017-12-25', title: 'Christmas'    },
      { id: 3, date: '2017-12-10', title: 'Avanade'      },
      { id: 4, date: '2017-12-02', title: 'Lollapalooza' },
      { id: 5, date: '2017-12-18', title: 'Never Forget' },
      { id: 6, date: '2017-12-22', title: 'Lorem Ipsum'  }
    ];
    return {appointments};
  }


}
