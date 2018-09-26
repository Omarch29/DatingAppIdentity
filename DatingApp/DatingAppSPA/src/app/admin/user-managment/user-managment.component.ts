import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { AdminService } from '../../services/admin.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.css']
})
export class UserManagmentComponent implements OnInit {
  users: User[];
  bsModalRef: BsModalRef;

  constructor(private adminService: AdminService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.getUserWithRoles();
  }

  getUserWithRoles() {
    this.adminService.getUsersWithRoles().subscribe((users: User[]) => {
      this.users = users;
    }, error =>  {
    console.log(error);
    });
  }

  editRolesModal(user: User) {
    console.log('userRoles:', user);
    const initialState = {
      user,
      roles: this.getRolesArray(user)
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, { initialState });
    this.bsModalRef.content.updateSelectedRoles.subscribe((values) => {
      const rolesToUpdate = {
        roleNames: [...values.filter(el => el.checked === true).map(el => el.name)]
      };
      if (rolesToUpdate) {
        this.adminService.updateUserRoles(user, rolesToUpdate).subscribe(() => {
          user.roles = [...rolesToUpdate.roleNames];
        }, error => {
          console.log(error);
        });
      }
    });
  }

  private getRolesArray(user) {
    const roles = [];
    const userRoles = user.roles;
    const avaiableRoles: any[] = [
      { name: 'Admin', value: 'Admin'},
      { name: 'Moderator', value: 'Moderator' },
      { name: 'Member', value: 'Member' },
      { name: 'VIP', value: 'VIP' }
    ];

    for (let i = 0; i < avaiableRoles.length; i++) {
      let isMatch = false;
      for (let j = 0; j < userRoles.length; j++) {
        if (avaiableRoles[i].name === userRoles[j]) {
          isMatch = true;
          avaiableRoles[i].checked = true;
          roles.push(avaiableRoles[i]);
          break;
        }
      }
      if (!isMatch) {
        avaiableRoles[i].checked = false;
        roles.push(avaiableRoles[i]);
      }
    }
    return roles;
  }

}
