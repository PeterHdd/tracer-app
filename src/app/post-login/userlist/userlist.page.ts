import { Component, OnInit } from '@angular/core';
import { TracerComponent } from 'src/app/components/component';
import { Person } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database-service/database.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.page.html',
  styleUrls: ['./userlist.page.scss'],
})
export class UserlistPage implements OnInit {

  peopleMet: Person[] = [];
  constructor(private component: TracerComponent,
              private dbService: DatabaseService) { }

  ngOnInit() {
    this.fetchListOfPeopleMet();
  }

  async fetchListOfPeopleMet() {
    await this.component.presentLoading();
    this.dbService.retrievePeople(this.dbService.getAuthenticatedUserId()).subscribe(async (result) => {
      await this.component.dismissLoading();
        this.peopleMet = result;
    });
  }

}
