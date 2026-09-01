import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-about',
  styleUrl: './about.scss',
  templateUrl: './about.html',
})
export class About implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'About Kemetica — Born in Aswan, 2018',
      description: 'Founded in Aswan in 2018, Kemetica is a luxury travel company specializing in private, Egyptologist-led expeditions. We craft deeply personal journeys through Egypt\'s ancient wonders.',
      keywords: 'about Kemetica, Egypt luxury travel company, Aswan founded, Egyptologist tours, private Egypt journeys',
      image: 'https://www.kemetica.com/about-us.jpeg',
      imageAlt: 'Kemetica team — Born in Aswan, Egypt 2018',
      canonical: 'https://www.kemetica.com/about',
    });
  }
}
