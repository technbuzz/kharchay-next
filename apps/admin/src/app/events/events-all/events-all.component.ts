import { Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { of as observableOf } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { files } from './example-data';
import { EventService } from '../../shared/events.service';
import { NavigationExtras, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/** File node data with possible child nodes. */
export interface FileNode {
  id?: string;
  name: string;
  subCollectionRef?: string;
  events?: FileNode[];
}

/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FlatTreeNode {
  name: string;
  level: number;
  expandable: boolean;
}

@Component({
    selector: 'kha-events-all',
    templateUrl: './events-all.component.html',
    styleUrls: ['./events-all.component.scss'],
    standalone: true,
    imports: [MatTreeModule, MatButtonModule, MatIconModule]
})
export class EventsAllComponent {

  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  // treeControl: FlatTreeControl<FlatTreeNode>;


  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileNode, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<FileNode, FlatTreeNode>;

  constructor(es: EventService, private router: Router) {
    this.treeFlattener = new MatTreeFlattener(
      this._transformer,
      node => node.level,
      node => node.expandable,
      node => node.events
    );

    // this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);

    this.treeControl = new FlatTreeControl(node => node.level, node => node.expandable);

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    // this.dataSource.data = files;
    es.getEvents().subscribe(resp => {
      
      this.dataSource.data = resp

    })
  }

  private _transformer = (node: FileNode, level: number) => {
    return {
      // expandable: !!node.children && node.children.length > 0,
      
      ...((level === 1) && { subCollectionRef: node.subCollectionRef, id: node.id }),
      expandable: !!node.events,
      name: node.name,
      level: level,
    };
  };

  /** Transform the data to something the tree can read. */
  // transformer(node: FileNode, level: number) {
  //   return {
  //     name: node.name,
  //     level: level,
  //     ...((level === 1) && { subCollectionRef: node.subCollectionRef, id: node.id }),
  //     expandable: !!node.events
  //   };
  // }

  /** Get the level of the node */
  getLevel(node: FlatTreeNode) {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  isExpandable(node: FlatTreeNode) {
    return node.expandable;
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: FlatTreeNode) {
    return node.expandable;
  }

  /** Get the children for the node. */
  getChildren(node: FileNode) {
    return observableOf(node.events);
  }

  
  navigateToEventsListing(item: any) {
    
    const extras: NavigationExtras = {

      state: {
        title: item.name,
        subCollectionRef: item.subCollectionRef
      },
    }
    this.router.navigate(['home/events/date', item.id], extras)
  }
}
