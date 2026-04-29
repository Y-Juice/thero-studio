import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  features = [
    {
      title: 'Design Tokens',
      text: 'Pick colors, fonts, spacing and radius and export a full CSS styleguide.'
    },
    {
      title: 'Drag & Drop Builder',
      text: 'Compose reusable UI components visually and save them to your library.'
    },
    {
      title: 'Starter Projects',
      text: 'Export ready to run Angular or React starters with your design system.'
    }
  ];
}
